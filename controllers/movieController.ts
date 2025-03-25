import { Response, Request } from 'express';
import AppError from '../utils/AppError';
import { tryCatch } from '../utils/tryCatch';
import Product from '../models/productModel';
import MovieSubscription from '../models/movieSubscription';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

export const createMovie = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { title } = req.body;

    const newMovie = await Product.create(req.body);

    res.status(201).json(newMovie);
  }
);

export const getMoviePublicData = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id, uid } = req.query;

    const movie = await Product.findOne({ _id: id });

    let subscribed = false;

    const subscriptions = await MovieSubscription.findOne({
      user_id: uid,
      product_id: id,
    });

    if (subscriptions) {
      subscribed = true;
    }

    res.json({ movie, subscribed });
  }
);
