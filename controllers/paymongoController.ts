import { tryCatch } from "../utils/tryCatch";
import { Response, Request } from "express";
import axios from "axios";
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
      method: "POST",
      url: "https://api.paymongo.com/v1/checkout_sessions",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
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
                currency: "PHP",
                amount: Number(finalPrice),
                description: description,
                name: `${title} - ${regType}`,
                quantity: 1,
              },
            ],
            payment_method_types: [
              "billease",
              "card",
              "dob",
              "dob_ubp",
              "gcash",
              "paymaya",
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
        console.error("SOMETHING WENT WRONG");
      });
  }
);

// RETRIEVE CHECKOUT
export const retrieveCheckout = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { checkoutId } = req.query;

    const options = {
      method: "GET",
      url: `https://api.paymongo.com/v1/checkout_sessions/${checkoutId}`,
      headers: {
        accept: "application/json",
        authorization: `Basic ${process.env.PAYMONGO_KEY}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.error("SOMETHING WENT WRONG");
      });
  }
);
