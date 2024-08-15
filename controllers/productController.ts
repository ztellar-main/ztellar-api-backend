import { Response, Request } from "express";
import { tryCatch } from "../utils/tryCatch";
import Product from "../models/productModel";
import Subject from "../models/subjectModel";
import AppError from "../utils/AppError";
import mongoose, { isValidObjectId } from "mongoose";
import {
  NOT_AUTHORIZED,
  PRODUCT_DOES_NOT_EXIST,
  SOMETHING_WENT_WRONG,
  SUBJECT_ALREADY_EXIST,
  SUBJECT_DOES_NOT_EXIST,
  TITLE_ALREADY_EXIST,
  TITLE_CANNOT_BE_EMPTY,
  VIDEO_TITLE_ALREADY_EXIST,
} from "../constants/errorCodes";
import Video from "../models/videoModel";
import User from "../models/userModel";
import { Document } from "mongoose";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// CREATE EVENT PRODUCT
export const createProduct = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    req.body.image_url = req.body.imageUrl;
    req.body.video_url = req.body.videoUrl;
    req.body.author_id = req.user;
    req.body.type = "event";

    const newProduct = await Product.create(req.body);

    res.status(201).json(newProduct);
  }
);

// GET ALL AUTHORS EVENTS
export const getAuthorProducts = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;

    const allAuthorProducts = await Product.find({
      author_id: userId,
      type: "event",
    }).select("_id author_id title subjects");
    res.status(200).json(allAuthorProducts);
  }
);

// ADD SUBJECT ON EVENT
export const addSubjectOnEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { title, productId, subjectTitle } = req.body;

    req.body.product_id = req.body.productId;
    req.body.author_id = userId;

    if (!title) {
      throw new AppError(
        TITLE_CANNOT_BE_EMPTY,
        "Subject title cannot be empty.",
        400
      );
    }

    const findTitle = await Subject.findOne({
      title,
      product_id: productId,
    });

    if (findTitle) {
      throw new AppError(
        SUBJECT_ALREADY_EXIST,
        "Subject title already exist in this event.",
        400
      );
    }

    const newSubject = await Subject.create(req.body);

    // POPULATE NEW SUBJECT TO COURSE
    const updateSubjectToCourse = await Product.updateOne(
      { _id: req.body.productId },
      { $push: { subjects: { _id: newSubject._id } } }
    );

    res.status(201).json(newSubject);
  }
);

// GET SINLE AUTHOR EVENT
export const getSingleAuthorEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const eventId = req.query.id;

    const event = await Product.findOne({
      author_id: userId,
      _id: eventId,
    })
      .populate({ path: "subjects._id", select: "title link product_id" })
      .populate({ path: "subjects.videos._id" });

    res.status(200).json(event);
  }
);

// CHECK IF SUBJECT IS OWNED OR EXISTING
export const checkEventSubject = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { productId, subjectId, subjectTitle } = req.body;

    if (!productId || !subjectId) {
      throw new AppError(
        SUBJECT_DOES_NOT_EXIST,
        "Something went wrong please try again.",
        400
      );
    }

    const subject = await Subject.findOne({
      _id: subjectId,
      product_id: productId,
      author_id: userId,
    });

    if (!subject) {
      throw new AppError(
        SUBJECT_DOES_NOT_EXIST,
        "Something went wrong please try again.",
        400
      );
    }

    res.json("success");
  }
);

// CHECK IF VIDEO TITLE ALREADY EXIST ON THE SUBJECT
export const checkVideoTitleExistOnSubject = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { title, productId, subjectId } = req.body;

    const video = await Video.findOne({
      title,
      product_id: productId,
      subject_id: subjectId,
      author_id: userId,
    });

    if (video) {
      throw new AppError(
        VIDEO_TITLE_ALREADY_EXIST,
        "Video title already exist.",
        400
      );
    }

    res.status(200).json("success");
  }
);

// ADD VIDEO TO EVENT SUBJECT
export const addVideoToEventSubject = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { title, productId, subjectId, duration, videoUrl } = req.body;

    if (!title || !productId || !subjectId || !duration || !videoUrl) {
      throw new AppError(
        SOMETHING_WENT_WRONG,
        "Something went wrong please try again.",
        400
      );
    }

    req.body.product_id = productId;
    req.body.subject_id = subjectId;
    req.body.author_id = userId;
    req.body.video_url = videoUrl;

    const newVideo = await Video.create(req.body);

    const addVideoToSubject = await Product.findOneAndUpdate(
      { _id: productId },
      { $push: { "subjects.$[e1].videos": { _id: newVideo._id } } },
      { arrayFilters: [{ "e1._id": subjectId }] }
    );

    res.status(201).json(addVideoToSubject);
  }
);

// GET PRODUCT SEARCH CARD
export const getProductSearchCard = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    let queryStr = JSON.stringify(req.query);
    const title = req.query.title.toString();
    let queryObj = JSON.parse(queryStr);
    const a = new RegExp(title, "i");

    queryObj.title = a;

    const products = await Product.find(queryObj)
      .populate({ path: "subjects._id", select: "title" })
      .populate({ path: "subjects.videos._id", select: "title" })
      .populate({ path: "author_id", select: "lname fname email avatar" })
      .select("-liveId -approved");

    if (!products) {
      throw new AppError(PRODUCT_DOES_NOT_EXIST, "Title does not exist.", 400);
    }

    res.status(200).json(products);
  }
);

// FIND PRODUCT ID
export const findProductId = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { id } = req.query;

    const validate = isValidObjectId(id);

    if (!validate) {
      throw new AppError(NOT_AUTHORIZED, "Somethings wrong", 400);
    }

    if (!userId) {
      throw new AppError(NOT_AUTHORIZED, "Somethings wrong", 400);
    }
    const findProduct = await Product.findById(id);

    if (!findProduct) {
      throw new AppError(NOT_AUTHORIZED, "Somethings wrong", 400);
    }

    res.status(200).json(findProduct);
  }
);

// GET OWNED PRODUCTS
export const getOwnedProducts = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;

    const products = await User.findById(userId).populate({
      path: "product_owned._id",
      populate: { path: "feedback" },
    });

    res.status(200).json(products);
  }
);

// GET VIEW EVENT DATA
export const getViewEventData = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const eventId = req.query.id;

    const validate = isValidObjectId(eventId);

    if (!validate) {
      throw new AppError(SOMETHING_WENT_WRONG, "Invalid id.", 400);
    }

    const event = await Product.findOne({ _id: eventId })
      .select("-prices")
      .populate([
        { path: "subjects._id", select: "title -_id" },
        { path: "subjects.videos._id", select: "title -_id" },
        {
          path: "feedback",
          populate: { path: "user", select: "avatar fname lname" },
        },
        {
          path: "author_id",
          select: "fname lname avatar",
        },
      ]);

    if (!event) {
      throw new AppError(SOMETHING_WENT_WRONG, "Event does not exist.", 400);
    }

    res.json(event);
  }
);

// EVENT QR SCAN
export const eventQrScan = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const productId = req.query.id;

    const validate = isValidObjectId(productId);

    if (!validate) {
      throw new AppError(SOMETHING_WENT_WRONG, "Event does not exist.", 400);
    }

    const event = await Product.findOne({
      _id: productId,
      author_id: userId,
    }).populate({
      path: "registered._id",
      select: "fname mname lname avatar email ",
    });

    res.json(event);
  }
);

export const updateLinks = tryCatch(async (req: Request, res: Response) => {
  let product = await Product.findOne({ _id: "6647f177f0cc04f6055fb3f6" });

  res.json("sample");
});

// ADD QUESTION
export const updateQuestionToEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const productId = "6688de27a366e5146109d850";
    const asd = [
      {
        question: "1. This is question",
        choices: [
          {
            label: "c",
            description: "This is a sample description",
          },
          {
            label: "b",
            description: "This is a sample description",
          },
          {
            label: "d",
            description: "This is a sample description",
          },
        ],
        answer: "c",
      },
      {
        question: "2. This is question",
        choices: [
          {
            label: "d",
            description: "This is a sample description",
          },
          {
            label: "e",
            description: "This is a sample description",
          },
        ],
        answer: "d",
      },
    ];

    const udpated = await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $set: { questions: asd },
      },
      { new: true }
    );

    res.json(udpated);
  }
);

// get event question
export const getEventQuestion = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { id } = req.query;
    const userId = req.user;

    const product = await Product.findOne({ _id: id });

    // check if user is registered start
    const a = product.registered.find((data) => {
      const a = data._id.toString();
      const b = a == userId;
      return b;
    });

    if (!a) {
      throw new AppError(
        SOMETHING_WENT_WRONG,
        "User is not registered on this event.",
        400
      );
    }
    // check if user is registered end

    const answersFromUser = await User.findOne({ _id: userId });

    const ifAnswerExistOnUser = answersFromUser.answers.find((data) => {
      return data.product_id.toString() == id;
    });

    // console.log(ifAnswerExistOnUser.finished);

    // console.log(ifAnswerExistOnUser);

    if (ifAnswerExistOnUser?.finished === true) {
      return res.json({ data: ifAnswerExistOnUser, finished: true });
    }

    if (!ifAnswerExistOnUser) {
      const questionIndex = 0;
      let question = product.questions[questionIndex];

      question.answer = undefined;

      return res.json({
        question,
        index: questionIndex,
        questionLength: product.questions.length,
        finished: false,
      });
    }

    const answersLength = ifAnswerExistOnUser.answers.length;
    let question = product.questions[answersLength];
    question.answer = undefined;

    res.json({
      question,
      index: answersLength,
      questionLength: product.questions.length,
      finished: false,
    });
  }
);

// save answer of event
export const saveAnswerOfEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { answer, productId, questionIndex } = req.body;

    // product questions
    const productQuestion = await Product.findOne({ _id: productId });

    const answerCount = questionIndex + 1;
    const questionCount = productQuestion.questions.length;

    const questionAnswer = productQuestion.questions[questionIndex].answer;

    // check the product id if exist on users answers
    const answersFromUser = await User.findOne({ _id: userId });

    const ifAnswerExistOnUser = answersFromUser.answers.find((data) => {
      return data.product_id == productId;
    });

    if (!ifAnswerExistOnUser) {
      await User.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            answers: { product_id: productId },
          },
        },
        { new: true }
      );
    }

    // save answer
    const udpateUserAnswer = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: {
          "answers.$[e1].answers": {
            number: 1,
            answer: answer,
            correct: questionAnswer === answer ? true : false,
          },
        },
        $inc: {
          "answers.$[e1].score": questionAnswer === answer ? 1 : 0,
        },
        $set: {
          "answers.$[e1].finished":
            answerCount === questionCount ? true : false,
        },
      },
      {
        arrayFilters: [{ "e1.product_id": productId }],
        new: true,
      }
    );

    res.json(udpateUserAnswer);
  }
);

// add sponsor logo to event
export const addSponsorLogoToEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const udpatedEvent = await Product.findOneAndUpdate(
      {
        _id: "6647f177f0cc04f6055fb3f6",
      },
      {
        $set: { sponsors_logo: req.body },
      },
      {
        new: true,
      }
    );

    res.json(udpatedEvent);
  }
);

// add sponsor post on view event
export const addSponsorPostOnEventView = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    console.log(req.body);
    try {
      const updatedEvent = await Product.findOneAndUpdate(
        {
          _id: "6647f177f0cc04f6055fb3f6",
        },
        {
          $set: { sponsors_videos: req.body },
        },
        {
          new: true,
        }
      );
      res.json(updatedEvent);
    } catch (err) {
      return res.json(err);
    }
  }
);
