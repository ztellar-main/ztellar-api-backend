import { tryCatch } from '../utils/tryCatch';
import { Response, Request } from 'express';
import axios from 'axios';
import { ERROR_HANDLER } from '../constants/errorCodes';
import AppError from '../utils/AppError';
import { addSponsorBoot } from './authorController';
import Product from '../models/productModel';
import User from '../models/userModel';
import Payment from '../models/paymentModel';
export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// CREATE CHECKOUT
export const createCheckout = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { regType, price, productId, productType, title, authorId } =
      req.body;

    const finalPrice = `${Number(price)}00`;

    const description = `${productId}/${authorId}/${productType}/${regType}/${userId}`;

    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/checkout_sessions',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${process.env.PAYMONGO_KEY}`,
      },
      data: {
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            cancel_url: process.env.MONGOPAY_CANCEL_URL,
            description: description,
            line_items: [
              {
                currency: 'PHP',
                amount: Number(finalPrice),
                description: description,
                name: `${title} - ${regType}`,
                quantity: 1,
              },
            ],
            payment_method_types: [
              'billease',
              'card',
              'dob',
              'dob_ubp',
              'gcash',
              'paymaya',
            ],
            success_url: process.env.MONGOPAY_SUCCESS_URL,
          },
        },
      },
    };
    // PROCEED TO CHECK OUT
    axios
      .request(options)
      .then(function (response) {
        return res.status(200).json(response.data.data);
      })
      .catch(function (error) {
        res.status(404).json(error);
        console.error('SOMETHING WENT WRONG');
      });
  }
);

// RETRIEVE CHECKOUT
export const retrieveCheckout = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { checkoutId } = req.query;

    const options = {
      method: 'GET',
      url: `https://api.paymongo.com/v1/checkout_sessions/${checkoutId}`,
      headers: {
        accept: 'application/json',
        authorization: `Basic ${process.env.PAYMONGO_KEY}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.error('SOMETHING WENT WRONG');
      });
  }
);

// CREATE CHECKOUT CASH PAYMENT
export const createCheckoutCashPayment = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { regType, price, productId, productType, title, authorId, uid } =
      req.body;

    const finalPrice = `${Number(price)}00`;

    const description = `${productId}/${authorId}/${productType}/${regType}/${uid}`;

    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/checkout_sessions',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${process.env.PAYMONGO_KEY_CASH_PAYMENT}`,
      },
      data: {
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            cancel_url: process.env.MONGOPAY_CANCEL_URL,
            description: description,
            line_items: [
              {
                currency: 'PHP',
                amount: Number(finalPrice),
                description: description,
                name: `${title} - ${regType}`,
                quantity: 1,
              },
            ],
            payment_method_types: [
              'billease',
              'card',
              'dob',
              'dob_ubp',
              'gcash',
              'paymaya',
            ],
            success_url: process.env.MONGOPAY_SUCCESS_URL_CASH_PAYMENT,
          },
        },
      },
    };
    // PROCEED TO CHECK OUT
    axios
      .request(options)
      .then(function (response) {
        return res.status(200).json(response.data.data);
      })
      .catch(function (error) {
        res.status(404).json(error);
        console.error('SOMETHING WENT WRONG');
      });
  }
);

// RETRIEVE CHECKOUT CASH PAYMENT
export const retrieveCheckoutCashPayment = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { checkoutId } = req.query;

    const options = {
      method: 'GET',
      url: `https://api.paymongo.com/v1/checkout_sessions/${checkoutId}`,
      headers: {
        accept: 'application/json',
        authorization: `Basic ${process.env.PAYMONGO_KEY_CASH_PAYMENT}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.error('SOMETHING WENT WRONG');
      });
  }
);

// CREATE PAYMENT INTENT
export const paymentIntent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { amount, title, id } = req.body;
    const finalDescription = `${title} - product_# ${id}`;

    const finalAmount = Number(`${amount}00`);
    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/payment_intents',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${process.env.COURSE_PAYMONGO_KEY}`,
      },
      data: {
        data: {
          attributes: {
            amount: finalAmount,
            payment_method_allowed: [
              'qrph',
              'card',
              'dob',
              'paymaya',
              'billease',
              'gcash',
              'grab_pay',
            ],
            payment_method_options: { card: { request_three_d_secure: 'any' } },
            currency: 'PHP',
            capture_type: 'automatic',
            description: finalDescription,
          },
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
);

// CREATE PAYMENT METHOD
export const createPaymentMethod = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { name, email, contact, paymentMethod } = req.body;

    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/payment_methods',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${process.env.COURSE_PAYMONGO_KEY}`,
      },
      data: {
        data: {
          attributes: {
            details: {
              card_number: '',
              exp_month: '',
              exp_year: '',
              cvc: '',
              bank_code: 'test_bank_two ',
            },
            billing: { name: name, email: email, phone: contact },
            type: paymentMethod,
          },
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
);

// ATTACH PAYMENT INTENT
export const attachPaymentIntent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { paymentMethodId, paymentIntentId, clientKey } = req.body;

    const redirectUrl = `${process.env.COURSE_PAYMONGO_REDIRECT}/process-payment?mid=${paymentMethodId}&cid=${clientKey}&pid=${paymentIntentId}`;

    const axios = require('axios');

    const options = {
      method: 'POST',
      url: `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${process.env.COURSE_PAYMONGO_KEY}`,
      },
      data: {
        data: {
          attributes: {
            payment_method: paymentMethodId,
            return_url: redirectUrl,
            client_key: clientKey,
          },
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        const url = response.data.data.attributes.next_action.redirect.url;

        res.status(200).json(url);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
);

// RETRIEVE PAYMENT INTENT
export const retrievePaymentIntent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { cid, pid } = req.body;
    const userId = req.user;

    try {
      const result = await axios({
        method: 'GET',
        url: `https://api.paymongo.com/v1/payment_intents/${pid}?client_key=${cid}`,
        headers: {
          accept: 'application/json',
          authorization: `Basic ${process.env.COURSE_PAYMONGO_KEY}`,
        },
      });

      const status = result?.data?.data.attributes.status;

      if (status !== 'succeeded') {
        throw new AppError(ERROR_HANDLER, 'Transaction not completed', 400);
      }

      // course description
      const description =
        result?.data?.data?.attributes?.payments[0]?.attributes?.description;
      // course id
      const num = Number(description.split(' ').length - 1);
      const courseId = description.split(' ')[num];
      // payment sourse
      const paymentSource =
        result?.data?.data?.attributes?.payments[0]?.attributes?.source?.type;
      // course price
      const price =
        result?.data?.data?.attributes?.payments[0]?.attributes?.amount;
      const finalPrice = Math.floor(price / 100);
      // paymongo fee
      const num2 = result?.data?.data?.attributes?.payments[0]?.attributes?.fee;
      const paymongoFee = Math.floor(num2 / 100);
      // less amount
      const lessAmount = finalPrice - paymongoFee;
      // author fee
      const authorFee = finalPrice * 0.6;
      // ztellar fee
      const ztellarFee = finalPrice * 0.4 - paymongoFee;
      // author
      const course = await Product.findOne({ _id: courseId, type: 'course' });

      const author = course.author_id;

      // if course already exist on user
      const user = await User.findOne({ _id: userId });

      const productOwned = user.product_owned.filter((data: any) => {
        const idString = data._id.toString();
        return idString === courseId;
      });

      const productOwnedLength = productOwned.length;

      if (productOwnedLength === 0) {
        // update user
        await User.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $push: { product_owned: { _id: courseId } },
          },
          { new: true }
        );
      }

      // if user already registered in course
      const courseFilter = course.registered.filter((data) => {
        return (data._id = userId);
      });

      const courseFilterLength = courseFilter.length;

      if (courseFilterLength === 0) {
        // update product
        await Product.findOneAndUpdate(
          {
            _id: courseId,
          },
          {
            $push: { registered: { _id: userId } },
          },
          {
            new: true,
          }
        );
      }

      // if payment record already exist
      const paymentRecord = await Payment.findOne({
        product_id: courseId,
        buyer_id: userId,
        product_type: 'course',
        author_id: author,
      });

      if (!paymentRecord) {
        // create payment record
        await Payment.create({
          author_id: author,
          product_type: 'course',
          buyer_id: userId,
          payment_mode: paymentSource,
          payment_source: 'paymongo',
          base_amount: finalPrice,
          less_amount: lessAmount,
          author_payment: authorFee,
          ztellar_fee: ztellarFee,
          product_id: courseId,
        });
      }

      res.status(200).json('success');
    } catch (err) {
      throw new AppError(ERROR_HANDLER, 'Transaction not completed', 400);
    }
  }
);

// EVENT PAYMENT

// create payment initent for event
// CREATE PAYMENT INTENT
export const createPaymentIntentForEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { amount, title, id, authorId, registrationType, paymentMethod } =
      req.body;

    const event = await Product.findOne({ _id: id }).select('transaction');

    let finalAmount: any;
    let transactionFee: any;
    let ztellarFee: any;

    const numberAmount = Number(amount);

    if (paymentMethod === 'gcash') {
      const rate = 0.022;
      const ztellar = Number(event?.transaction?.value) - rate;
      ztellarFee = amount * Number(ztellar);
      const f = 1 - rate;
      const subAmount = numberAmount / f;
      const finalSubAmount = Math.ceil(subAmount) + ztellarFee;
      finalAmount = Math.ceil(Number(finalSubAmount));
    }

    if (paymentMethod === 'paymaya') {
      const rate = 0.019;
      const ztellar = Number(event?.transaction?.value) - rate;
      ztellarFee = amount * Number(ztellar);
      const f = 1 - rate;
      const subAmount = numberAmount / f;
      const finalSubAmount = Math.ceil(subAmount) + ztellarFee;
      finalAmount = Math.ceil(Number(finalSubAmount));
      transactionFee = finalAmount - amount;
    }

    const finalDescription = `${id}/${authorId}/${registrationType}/${amount}/${transactionFee}/${ztellarFee}`;

    const toPay = Number(`${finalAmount}00`);

    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/payment_intents',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${process.env.COURSE_PAYMONGO_KEY}`,
      },
      data: {
        data: {
          attributes: {
            amount: toPay,
            payment_method_allowed: [
              'qrph',
              'card',
              'dob',
              'paymaya',
              'billease',
              'gcash',
              'grab_pay',
            ],
            payment_method_options: { card: { request_three_d_secure: 'any' } },
            currency: 'PHP',
            capture_type: 'automatic',
            description: finalDescription,
          },
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
);

// CREATE PAYMENT METHOD FOR EVENT
export const createPaymentMethodForEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { name, email, contact, paymentMethod } = req.body;

    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/payment_methods',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${process.env.COURSE_PAYMONGO_KEY}`,
      },
      data: {
        data: {
          attributes: {
            details: {
              card_number: '',
              exp_month: '',
              exp_year: '',
              cvc: '',
              bank_code: 'test_bank_two ',
            },
            billing: { name: name, email: email, phone: contact },
            type: paymentMethod,
          },
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
);

// ATTACH PAYMENT INTENT FOR EVENT
export const attachPaymentIntentForEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { paymentMethodId, paymentIntentId, clientKey } = req.body;

    const redirectUrl = `${process.env.COURSE_PAYMONGO_REDIRECT}/process-payment/e?mid=${paymentMethodId}&cid=${clientKey}&pid=${paymentIntentId}`;

    const axios = require('axios');

    const options = {
      method: 'POST',
      url: `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${process.env.COURSE_PAYMONGO_KEY}`,
      },
      data: {
        data: {
          attributes: {
            payment_method: paymentMethodId,
            return_url: redirectUrl,
            client_key: clientKey,
          },
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        const url = response.data.data.attributes.next_action.redirect.url;

        res.status(200).json(url);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
);

// RETRIEVE PAYMENT INTENT
export const retrievePaymentIntentForEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { cid, pid } = req.body;
    const userId = req.user;

    try {
      const result = await axios({
        method: 'GET',
        url: `https://api.paymongo.com/v1/payment_intents/${pid}?client_key=${cid}`,
        headers: {
          accept: 'application/json',
          authorization: `Basic ${process.env.COURSE_PAYMONGO_KEY}`,
        },
      });

      const status = result?.data?.data.attributes.status;

      if (status !== 'succeeded') {
        throw new AppError(ERROR_HANDLER, 'Transaction not completed', 400);
      }

      // course description
      const description =
        result?.data?.data?.attributes?.payments[0]?.attributes?.description;
      const eventId = description.split('/')[0];
      const authorId = description.split('/')[1];
      const regType = description.split('/')[2];
      const amount = description.split('/')[3];
      const transactionFee = description.split('/')[4];
      const ztellarFee = description.split('/')[5];

      // // payment sourse
      const paymentSource =
        result?.data?.data?.attributes?.payments[0]?.attributes?.source?.type;
      // course price
      const price =
        result?.data?.data?.attributes?.payments[0]?.attributes?.amount;

      const finalPrice = Math.floor(price / 100);

      // paymongo fee
      const num2 = result?.data?.data?.attributes?.payments[0]?.attributes?.fee;
      const paymongoFee = Math.floor(num2 / 100);
      // less amount
      const lessAmount = finalPrice - paymongoFee;
      // author fee
      console.log(lessAmount);

      // // author
      // const course = await Product.findOne({ _id: courseId, type: 'course' });

      // const author = course.author_id;

      // START
      // if course already exist on user
      const user = await User.findOne({ _id: userId });

      const productOwned = user.product_owned.filter((data: any) => {
        const idString = data._id.toString();
        return idString === eventId;
      });

      const productOwnedLength = productOwned.length;

      if (productOwnedLength === 0) {
        // update user
        await User.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $push: {
              product_owned: {
                _id: eventId,
                qr_code: userId,
                reg_type: regType,
                product_type: 'event',
              },
            },
          },
          { new: true }
        );
      }

      // update event

      // if user already registered in course
      const event = await Product.findOne({ _id: eventId });
      const courseFilter = event.registered.filter((data) => {
        return (data._id = userId);
      });

      const courseFilterLength = courseFilter.length;

      console.log(courseFilterLength);

      if (courseFilterLength === 0) {
        // update product
        await Product.findOneAndUpdate(
          {
            _id: eventId,
          },
          {
            $push: {
              registered: {
                _id: userId,
                qr_code: userId,
                reg_type: regType,
                product_type: 'event',
                author_payment: amount,
                ztellar_fee: ztellarFee,
                payment_mode: paymentSource,
              },
            },
          },
          {
            new: true,
          }
        );
      }

      // // END

      // if payment record already exist
      const paymentRecord = await Payment.findOne({
        product_id: eventId,
        buyer_id: userId,
        product_type: 'event',
        author_id: authorId,
      });

      if (paymentRecord) {
        console.log('exist');
      } else {
        console.log('not exist');
        // create payment record
        await Payment.create({
          author_id: authorId,
          product_type: 'event',
          buyer_id: userId,
          payment_mode: paymentSource,
          payment_source: 'paymongo',
          base_amount: finalPrice,
          less_amount: lessAmount,
          author_payment: amount,
          ztellar_fee: ztellarFee,
          product_id: eventId,
        });
      }
      const updateAuthor = await User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { author_event_balance: amount },
        }
      );

      // if (!paymentRecord) {

      // }

      res.status(200).json('success');
    } catch (err) {
      throw new AppError(ERROR_HANDLER, 'Transaction not completed', 400);
    }
  }
);
