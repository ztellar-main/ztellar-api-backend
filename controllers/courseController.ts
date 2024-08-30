import { Response, Request } from 'express';
import { tryCatch } from '../utils/tryCatch';
import Product from '../models/productModel';
import AppError from '../utils/AppError';
import { ERROR_HANDLER } from '../constants/errorCodes';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// check if course title exist
export const ifTitleExist = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title } = req.body;

    const course = await Product.findOne({ title });

    if (course) {
      throw new AppError(ERROR_HANDLER, 'This title already exists', 400);
    }

    res.status(200).json('success');
  }
);

// check if live id exist
export const ifLiveIdExist = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { liveId } = req.body;

    const course = await Product.findOne({ live_id: liveId });

    if (course) {
      throw new AppError(ERROR_HANDLER, 'This live id already axists', 400);
    }

    res.status(200).json('success');
  }
);

// create course
export const createCourse = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title, description, price, liveId, videoUrl, imageUrl, socketId } =
      req.body;

    if (!title || !description || !price || !liveId || !videoUrl || !imageUrl) {
      throw new AppError(
        ERROR_HANDLER,
        'There is something wrong in your information',
        400
      );
    }

    const newCourse = await Product.create({
      title,
      description,
      course_price: price,
      liveId,
      video_url: videoUrl,
      image_url: imageUrl,
      type: 'course',
    });

    res.json(newCourse);
  }
);

// update course intro video after converting video
export const updateCourseIntroVideoAfterConvertingVideo = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoPath, courseId } = req.body;

    const updatedCourse = await Product.findOneAndUpdate(
      { _id: courseId },
      {
        $set: { converted_video_intro: `${videoPath}.m3u8` },
      },
      { new: true }
    );

    res.json(updatedCourse);
  }
);
