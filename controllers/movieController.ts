import { Response, Request } from 'express';
import AppError from '../utils/AppError';
import { tryCatch } from '../utils/tryCatch';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

export const createEventFeedback = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    
  }
);
