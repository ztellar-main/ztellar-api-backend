import { tryCatch } from '../utils/tryCatch';
import { Response, Request } from 'express';
import axios from 'axios';
import { ERROR_HANDLER } from '../constants/errorCodes';
import AppError from '../utils/AppError';
import { addSponsorBoot } from './authorController';
import Product from '../models/productModel';
import User from '../models/userModel';
import Payment from '../models/paymentModel';
import Pidcid from '../models/PidCid';
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
    const userId = req.user;

    const {
      amount,
      title,
      id,
      authorId,
      registrationType,
      paymentMethod,
      baseAmount,
    } = req.body;

    const event = await Product.findOne({ _id: id }).select('transaction');

    const finalDescription = `${id}/${authorId}/${registrationType}/${baseAmount}/${amount}/${paymentMethod}/${userId}`;

    const finalAmount = Math.ceil(amount);

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
    const userId = req.user;
    const { paymentMethodId, paymentIntentId, clientKey } = req.body;

    const redirectUrl = `${process.env.COURSE_PAYMONGO_REDIRECT}/process-payment/e?mid=${paymentMethodId}&cid=${clientKey}&pid=${paymentIntentId}`;

    await Pidcid.create({ pid: paymentIntentId, cid: clientKey, userId });
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
    // const userId = req.user;

    const pidCid = await Pidcid.findOne({ cid, pid });

    if (!pidCid) {
      throw new AppError(ERROR_HANDLER, 'Transaction not completed', 400);
    }

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

    const description =
      result?.data?.data?.attributes?.payments[0]?.attributes?.description;
    const eventId = description.split('/')[0];
    const authorId = description.split('/')[1];
    const regType = description.split('/')[2];
    const baseAmount = description.split('/')[3];
    const wholeAmount = description.split('/')[4];
    const paymentMethod = description.split('/')[5];
    const userId = description.split('/')[6];

    let ztellarFee: any;

    if (paymentMethod === 'gcash') {
      const rate = 0.022;
      const a = Number(wholeAmount) * rate;
      const b = wholeAmount - a;
      ztellarFee = parseFloat((Number(b) - Number(baseAmount)).toFixed(2));
    }

    if (paymentMethod === 'paymaya') {
      const rate = 0.019;
      const a = Number(wholeAmount) * rate;
      const b = wholeAmount - a;
      ztellarFee = parseFloat((Number(b) - Number(baseAmount)).toFixed(2));
    }

    // author

    // START
    // if course already exist on user
    const user = await User.findOne({ _id: userId });

    const productOwned = user.product_owned.find((data: any) => {
      const idString = data._id.toString();
      return idString === eventId;
    });

    if (!productOwned) {
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
    console.log({
      userId,
      regType,
      baseAmount,
      ztellarFee,
      paymentMethod,
    });

    // if user already registered in course
    const event = await Product.findOne({ _id: eventId });
    const courseFilter = event.registered.find((data) => {
      const dataId = data._id.toString();
      return dataId === userId;
    });

    if (!courseFilter) {
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
              author_payment: baseAmount,
              ztellar_fee: ztellarFee,
              payment_mode: paymentMethod,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    // END
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
        payment_mode: paymentMethod,
        payment_source: 'paymongo',
        author_payment: baseAmount,
        ztellar_fee: ztellarFee,
        product_id: eventId,
      });
    }
    await User.findOneAndUpdate(
      { _id: authorId },
      {
        $inc: { author_event_balance: baseAmount },
      }
    );

    // DELETE PIDCID
    await Pidcid.findByIdAndDelete(pidCid._id);

    res.status(200).json('success');
  }
);

// create payment intent for course
export const createPaymentIntentForCourse = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;

    const { amount, courseId, authorId, months, paymentMethod, baseAmount } =
      req.body;

    const finalDescription = `course/${courseId}/${authorId}/${months}/${amount}/${baseAmount}/${paymentMethod}/${userId}`;

    const finalAmount = Math.ceil(amount);

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

// CREATE PAYMENT METHOD FOR COURSE
export const createPaymentMethodForcourse = tryCatch(
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

// ATTACH PAYMENT INTENT FOR COURSE
export const attachPaymentIntentForCourse = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { paymentMethodId, paymentIntentId, clientKey } = req.body;

    const redirectUrl = `${process.env.COURSE_PAYMONGO_REDIRECT}`;

    await Pidcid.create({ pid: paymentIntentId, cid: clientKey, userId });
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

export const paymongoWebhookForCourse = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const event = req.body;

    const description = event?.data?.attributes?.data?.attributes?.description;

    const productType = description.split('/')[0];

    if (!event || !event.data || !event.data.attributes) {
      return res.status(400).send('Invalid Webhook Data');
    }

    const eventType = event.data.attributes.type;

    console.log(eventType);

    switch (eventType) {
      case 'payment.paid':
        if (productType === 'course') {
          const courseId = description.split('/')[1];
          const authorId = description.split('/')[2];
          const months = description.split('/')[3];
          const amount = description.split('/')[4];
          const baseAmount = description.split('/')[5];
          const paymentMethod = description.split('/')[6];
          const userId = description.split('/')[7];

          let ztellarFee: any;
          const authorFee = Number(baseAmount) * 0.6;

          // COURSE
          if (paymentMethod === 'gcash') {
            const rate = 0.022;
            const a = Number(amount) * rate;
            const b = Number(amount) - a;
            const authorFeeA = Number(baseAmount) * 0.6;

            ztellarFee = parseFloat(
              (Number(b) - Number(authorFeeA)).toFixed(2)
            );
          }

          if (paymentMethod === 'paymaya') {
            const rate = 0.019;
            const a = Number(amount) * rate;
            const b = Number(amount) - a;
            const authorFeeA = Number(baseAmount) * 0.6;

            ztellarFee = parseFloat(
              (Number(b) - Number(authorFeeA)).toFixed(2)
            );
          }

          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + Number(months));

          // UDPATE USER
          const user = await User.findOne({ _id: userId });

          const productOwned = user.product_owned.find((data: any) => {
            const idString = data._id.toString();
            return idString === courseId;
          });

          if (!productOwned) {
            await User.findOneAndUpdate(
              {
                _id: userId,
              },
              {
                $push: {
                  product_owned: {
                    _id: courseId,
                    qr_code: userId,
                    expiry: expiryDate,
                    product_type: 'course',
                  },
                },
              },
              { new: true, upsert: false }
            );
          }

          if (productOwned) {
            await User.findOneAndUpdate(
              {
                _id: userId,
              },
              {
                $set: {
                  'product_owned.$[e1].expiry': expiryDate,
                },
              },
              { arrayFilters: [{ 'e1._id': courseId }] }
            );
          }

          // UDPATE COURSE
          const event = await Product.findOne({ _id: courseId });
          const courseFilter = event.registered.find((data) => {
            const dataId = data._id.toString();
            return dataId === userId;
          });

          if (!courseFilter) {
            // update product
            await Product.findOneAndUpdate(
              {
                _id: courseId,
              },
              {
                $push: {
                  registered: {
                    _id: userId,
                    qr_code: userId,
                    product_type: 'course',
                    author_payment: authorFee,
                    ztellar_fee: ztellarFee,
                    payment_mode: paymentMethod,
                    expiry: expiryDate,
                  },
                },
              },
              {
                new: true,
                upsert: false,
              }
            );
          }

          // CREATE PAYMENT RECORD
          // if payment record already exist
          const paymentRecord = await Payment.findOne({
            product_id: courseId,
            buyer_id: userId,
            product_type: 'course',
            author_id: authorId,
          });

          // if (paymentRecord) {
          //   console.log('exist');
          // } else {
          //   console.log('not exist');
          // create payment record
          await Payment.create({
            author_id: authorId,
            product_type: 'course',
            buyer_id: userId,
            payment_mode: paymentMethod,
            payment_source: 'paymongo',
            author_payment: authorFee,
            ztellar_fee: ztellarFee,
            product_id: courseId,
          });
          // }

          // UPDATE AUTHOR BALANCE
          await User.findOneAndUpdate(
            { _id: authorId },
            {
              $inc: { author_event_balance: authorFee },
            },
            {
              new: true,
              upsert: false,
            }
          );

          return res.status(200).json('success');
        }
        break;
      case 'payment.failed':
        console.log('❌ Payment Failed:', event.data);
        break;
      case 'source.chargeable':
        console.log('⚡ Source Chargeable:', event.data);
        break;
      default:
        console.log('🔔 Unknown Event:', event.data);
    }

    res.status(200).json('success');
  }
);
