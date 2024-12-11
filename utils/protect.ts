import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

export const protect = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth || auth === '') {
    return res.status(401).json('You are not authorized.');
  }

  const token = req.headers.authorization.split(' ')[1];
  if (!token || token === '') {
    return res.status(401).json('You are not authorized.');
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    req.user = user._id;

    return next();
  } catch (err) {
    return res.status(401).json('You are not authorized. Invalid token');
  }
};

export const authorDashboardProtect = (role: any) => {
  return async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ) => {
    const auth = req.headers.authorization;
    if (!auth || auth === '') {
      return res.status(401).json('You are not authorized.');
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token || token === '') {
      return res.status(401).json('You are not authorized.');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');

      const authorize = role.includes(user.role);

      if (!authorize) {
        return res.status(401).json('You are not authorized.');
      }

      req.user = user._id;

      return next();
    } catch (err) {
      return res.status(401).json('You are not authorized. Invalid token');
    }
  };
};
