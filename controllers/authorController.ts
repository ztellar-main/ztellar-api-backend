import { SOMETHING_WENT_WRONG } from "../constants/errorCodes";
import Feedback from "../models/feedbackModel";
import Payment from "../models/paymentModel";
import Product from "../models/productModel";
import AppError from "../utils/AppError";
import { tryCatch } from "../utils/tryCatch";
import { Response, Request } from "express";
import mongoose from "mongoose";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

export const authorProducts = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    let { id } = req.query;
    // const products = await Payment.find({ author_id: id });

    // const asd = products.map((data) => {
    //   return data.registered;
    // });

    const aggregatedPayment = await Payment.aggregate([
      {
        $match: {
          author_id: new mongoose.Types.ObjectId(id.toString()),
        },
      },
      {
        $group: {
          _id: {
            authorId: "$author_id",
            productId: "$product_id",
          },

          total: { $sum: "$author_payment" },
          faceToFace: {
            $sum: { $cond: [{ $eq: ["$reg_type", "face_to_face"] }, 1, 0] },
          },
          virtual: {
            $sum: { $cond: [{ $eq: ["$reg_type", "virtual"] }, 1, 0] },
          },
        },
      },

      {
        $lookup: {
          from: "users", // The name of the foreign collection
          localField: "_id.authorId", // The field from the input documents
          foreignField: "_id", // The field from the foreign documents
          as: "author", // The name of the array field to add
        },
      },
      {
        $lookup: {
          from: "products", // The name of the foreign collection
          localField: "_id.productId", // The field from the input documents
          foreignField: "_id", // The field from the foreign documents
          as: "product", // The name of the array field to add
        },
      },
      {
        $unwind: "$product",
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          _id: 0,
          total: 1,
          authorId: "$_id.authorId",
          "product.title": 1,
          "product.registered": 1,
          "author.fname": 1,
          faceToFace: 1,
          virtual: 1,
        },
      },
    ]);

    res.json(aggregatedPayment);
  }
);
