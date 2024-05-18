import { Request, Response, NextFunction } from "express";
export const tryCatch =
  (controller:any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (err) {
      return next(err);
    }
  };
