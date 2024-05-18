import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const errorHandler = (error:any, req: Request, res: Response, next: NextFunction) => {
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            type: 'ValidationError',
            details: error
        });
    }

    if(error.type === 'AppError'){
        return res.status(error.statusCode).json({
            errorCode: error.errorCode,
            message: error.message
        });
    }

    console.log(error)

    return res.status(500).json("Something went wrong.");
};

export default errorHandler;
