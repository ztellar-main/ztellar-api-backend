import Payment from '../models/paymentModel';
import Product from '../models/productModel';
import User from '../models/userModel';
import { tryCatch } from '../utils/tryCatch';
import { Response, Request } from 'express';
import mongoose from 'mongoose';
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
            author_payment: authorPayment,
            ztellar_fee: ztellarFee,
            payment_mode: paymentMode,
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
    const updateAuthor = await User.findOneAndUpdate(
      { _id: authorId },
      {
        $inc: { author_event_balance: authorPayment },
      }
    );
    res.status(201).json('success');
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

    res.status(201).json('success');
  }
);

// CASH PAYMENT
export const createCashPayment = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { authorId, productId, productType, regType, buyerId, priceFinal } =
      req.body;

    const userId = buyerId;

    const authorPaymentFinal = Number(priceFinal) * 0.9;
    const ztellarFeeFinal = Number(priceFinal) * 0.1;

    // console.log({
    //   authorId,
    //   productId,
    //   productType,
    //   regType,
    //   buyerId,
    //   priceFinal,
    //   authorPaymentFinal,
    //   ztellarFeeFinal,
    //   userId,
    // });

    const userUpdate = await User.findByIdAndUpdate(
      { _id: "6736fbffe712651f3bd3876d" }, //
      {
        $push: {
          product_owned: {
            _id: "66b1e778ecaa46a200a6eb83",
            qr_code: "6736fbffe712651f3bd3876d", //
            reg_type: "virtual",
            product_type: "event",
          },
        },
      },
      { new: true, upsert: true }
    );

    const courseUpdate = await Product.findByIdAndUpdate(
      { _id: "66b1e778ecaa46a200a6eb83" },
      {
        $push: {
          registered: {
            _id: "6736fbffe712651f3bd3876d", //
            qr_code: "6736fbffe712651f3bd3876d", //
            reg_type: 'virtual',
            product_type: "event",
            author_payment: 930,
            ztellar_fee: 28,
            payment_mode: 'card',//
            date: new Date("2024-11-15T07:51:45.711Z")//
          },
        },
      },
      { new: true, upsert: true }
    );

    const savePayment = await Payment.create({
      author_id: "66ad77d8606b8b7cf750ede4",
      product_type: "event",
      product_id: "66b1e778ecaa46a200a6eb83",
      reg_type: 'virtual',
      buyer_id: '6736fbffe712651f3bd3876d', //
      payment_mode: 'card',//
      payment_source: 'paymongo',
      author_payment: 930,
      ztellar_fee: 28,//
      date: new Date("2024-11-15T07:51:45.711Z")//
    });

    const updateAuthor = await User.findOneAndUpdate(
      { _id: "66ad77d8606b8b7cf750ede4" },
      {
        $inc: { author_event_balance: 930 },
      }
    );

    res.status(201).json('success');
  }
);
