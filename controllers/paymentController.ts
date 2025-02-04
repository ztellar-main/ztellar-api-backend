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
    let finalZtellarFee = 0;
    let finalAuthorFee = 0;

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
      transactionFee,
    } = req.body;

    const event = await Product.findOne({ _id: productId });

    if (event.pay_rate.rate_type === 'percent') {
      const transacFee = (event.pay_rate.value / 100) * baseAmount;
      finalZtellarFee = transacFee - transactionFee;
      finalAuthorFee = baseAmount - transacFee;
    }

    if (event.pay_rate.rate_type === 'amount') {
      const transacFee = event.pay_rate.value;
      finalZtellarFee = transacFee - transactionFee;
      finalAuthorFee = baseAmount - transacFee;
    }

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
            author_payment: finalAuthorFee,
            ztellar_fee: finalZtellarFee,
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
      author_payment: finalAuthorFee,
      ztellar_fee: finalZtellarFee,
    });
    const updateAuthor = await User.findOneAndUpdate(
      { _id: authorId },
      {
        $inc: { author_event_balance: finalAuthorFee },
      }
    );
    res.status(201).json('success');
  }
);

// CREATE PAYMENT
export const createPaymentCashPayment = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    let finalZtellarFee = 0;
    let finalAuthorFee = 0;

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
      transactionFee,
    } = req.body;

    const userId = buyerId;

    const event = await Product.findOne({ _id: productId });

    if (event.pay_rate.rate_type === 'percent') {
      const transacFee = (event.pay_rate.value / 100) * baseAmount;
      finalZtellarFee = transacFee - transactionFee;
      finalAuthorFee = baseAmount - transacFee;
    }

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
            author_payment: finalAuthorFee,
            ztellar_fee: finalZtellarFee,
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

    const userUpdate = await User.findByIdAndUpdate(
      { _id: '67a027d5c11b631324a03a3b' }, //
      {
        $push: {
          product_owned: {
            _id: '66b1e778ecaa46a200a6eb83', //
            qr_code: '67a027d5c11b631324a03a3b', //
            reg_type: 'virtual',
            product_type: 'event',
          },
        },
      },
      { new: true, upsert: true }
    );

    const courseUpdate = await Product.findByIdAndUpdate(
      { _id: '66b1e778ecaa46a200a6eb83' },
      {
        $push: {
          registered: {
            _id: '67a027d5c11b631324a03a3b', //
            qr_code: '67a027d5c11b631324a03a3b', //
            reg_type: 'virtual',
            product_type: 'event',
            author_payment: 1000,
            ztellar_fee: 46.46,
            payment_mode: 'gcash', //
            date: new Date('2025-02-03T07:51:45.711Z'), //
          },
        },
      },
      { new: true, upsert: true }
    );

    const savePayment = await Payment.create({
      author_id: '66ad77d8606b8b7cf750ede4',
      product_type: 'event',
      product_id: '66b1e778ecaa46a200a6eb83',
      reg_type: 'virtual',
      buyer_id: '67a027d5c11b631324a03a3b', //
      payment_mode: 'gcash', //
      payment_source: 'paymongo',
      author_payment: 1000,
      ztellar_fee: 46.46, //
      date: new Date('2025-02-03T11:50:45.711Z'), //
    });

    const updateAuthor = await User.findOneAndUpdate(
      { _id: '66ad77d8606b8b7cf750ede4' },
      {
        $inc: { author_event_balance: 1000 },
      }
    );

    res.status(201).json('success');
  }
);
