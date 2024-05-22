import Payment from "../models/paymentModel";
import Product from "../models/productModel";
import User from "../models/userModel";
import { tryCatch } from "../utils/tryCatch";
import { Response, Request } from "express";
import mongoose from "mongoose";
export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// CREATE PAYMENT
export const createPayment = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;

    // const userId = "6648af4ed324ee229b29acd5";

    const {
      lessAmount,
      baseAmount,
      paymentMode,
      paymentSource,
      authorId,
      productId,
      productType,
      regType,
      buyerId,
      authorPayment,
      ztellarFee,
    } = req.body;

    const userUpdate = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          product_owned: {
            _id: productId,
            qr_code: userId,
            reg_type: regType,
            product_type: productType,
          },
        },
      },
      { new: true, upsert: true }
    );

    const courseUpdate = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        $push: {
          registered: {
            _id: userId,
            qr_code: userId,
            reg_type: regType,
            product_type: productType,
          },
        },
      },
      { new: true, upsert: true }
    );

    const savePayment = await Payment.create({
      author_id: authorId,
      product_type: productType,
      product_id: productId,
      reg_type: regType,
      buyer_id: buyerId,
      payment_mode: paymentMode,
      payment_source: paymentSource,
      base_amount: baseAmount,
      less_amount: lessAmount,
      author_payment: authorPayment,
      ztellar_fee: ztellarFee,
    });

    res.status(201).json("success");
  }
);

// CREATE PAYMENT
export const createPaymentCashPayment = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const {
      lessAmount,
      baseAmount,
      paymentMode,
      paymentSource,
      authorId,
      productId,
      productType,
      regType,
      buyerId,
      authorPayment,
      ztellarFee,
    } = req.body;

    const userId = buyerId;

    const userUpdate = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          product_owned: {
            _id: productId,
            qr_code: userId,
            reg_type: regType,
            product_type: productType,
          },
        },
      },
      { new: true, upsert: true }
    );

    const courseUpdate = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        $push: {
          registered: {
            _id: userId,
            qr_code: userId,
            reg_type: regType,
            product_type: productType,
          },
        },
      },
      { new: true, upsert: true }
    );

    const savePayment = await Payment.create({
      author_id: authorId,
      product_type: productType,
      product_id: productId,
      reg_type: regType,
      buyer_id: buyerId,
      payment_mode: paymentMode,
      payment_source: paymentSource,
      base_amount: baseAmount,
      less_amount: lessAmount,
      author_payment: authorPayment,
      ztellar_fee: ztellarFee,
    });

    res.status(201).json("success");
  }
);
