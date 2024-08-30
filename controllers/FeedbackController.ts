import { SOMETHING_WENT_WRONG } from "../constants/errorCodes";
import Feedback from "../models/feedbackModel";
import Product from "../models/productModel";
import AppError from "../utils/AppError";
import { tryCatch } from "../utils/tryCatch";
import { Response, Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

export const createEventFeedback = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;

    const { comment, rating, productId } = req.body;

    if (!comment || !rating || !productId) {
      throw new AppError(
        SOMETHING_WENT_WRONG,
        "Please fill up all fields.",
        400
      );
    }

    req.body.product_id = productId;
    req.body.user = userId;

    const findUser = await Feedback.findOne({
      product_id: productId,
      user: userId,
    });

    if (findUser) {
      throw new AppError(
        SOMETHING_WENT_WRONG,
        "You have already leave your feedback. Please refresh the page.",
        400
      );
    }

    const newFeedback = await Feedback.create(req.body);

    const saveToProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $push: { feedback: { _id: newFeedback._id } } },
      { new: true, upsert: true }
    );

    const updateFeedbackCount = await Product.findOneAndUpdate(
      { _id: productId },
      { $inc: { feedback_count: 1 } }
    );

    const getFeedbacks = await Feedback.find({ product_id: productId });

    const sum = getFeedbacks.reduce((accumulator, object) => {
      return accumulator + object.rating;
    }, 0);

    const ratings_average = sum / getFeedbacks.length;

    // UPDATE RATING AVERAGE
    const updateRatingAverage = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: { average_rating: ratings_average } }
    );
    res.status(201).json("Leave review success");
  }
);
