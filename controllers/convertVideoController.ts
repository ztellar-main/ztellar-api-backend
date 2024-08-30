import { Response, Request } from 'express';
import { tryCatch } from '../utils/tryCatch';
import Product from '../models/productModel';
import AppError from '../utils/AppError';
import { ERROR_HANDLER } from '../constants/errorCodes';
import { convertToHLSAndUpload } from '../utils/videoConverter';
import path from 'path';
import fs from 'fs';
import { errorMonitor } from 'stream';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// convert video to hls
export const convertVideoToHls = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoUrl, filePath, socketId, fileName } = req.body;
    //   `course/converted/${courseId}/video_intro/denver`;
    try {
      await convertToHLSAndUpload(videoUrl, filePath, fileName);
      res.json('success');
    } catch (err) {
      res.json(err);
    }
  }
);
