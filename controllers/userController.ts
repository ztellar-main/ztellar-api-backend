import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import AppError from "../utils/AppError";
import {
  EMAIL_ALREADY_EXIST,
  EMAIL_ALREADY_REGISTERED,
  EMAIL_DID_NOT_SENT,
  EMAIL_DOES_NOT_EXIST,
  INVALID_EMAIL,
  INVALID_EMAIL_OR_PASSWORD,
  INVALID_OTP,
  OTP_ALREADY_EXPIRED,
  OTP_DOES_NOT_EXIST,
  SOMETHING_WENT_WRONG,
  USER_NOT_FOUND,
} from "../constants/errorCodes";
import { sendOtp } from "../utils/sendOtp";
import bcrypt from "bcryptjs";
import Otp from "../models/otpModel";
import * as EmailValidator from "email-validator";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// SEND OTP
export const sendOTp = tryCatch(async (req: Request, res: Response) => {
  const { email } = req.body;

  const emailValidate = EmailValidator.validate(email);

  if (!emailValidate) {
    throw new AppError(INVALID_EMAIL, "Invalid email.", 400);
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new AppError(
      EMAIL_ALREADY_EXIST,
      "This email is already registered.",
      400
    );
  }

  // send otp
  const sentOtp = await sendOtp(email);

  if (!sentOtp) {
    throw new AppError(EMAIL_DID_NOT_SENT, "Email did not sent.", 400);
  }

  res.status(200).json("success");
});

// GET EMAIL
export const getEmail = tryCatch(async (req: Request, res: Response) => {
  const { email } = req.body;

  const userEmail = await User.findOne({ email });

  if (userEmail) {
    throw new AppError(
      EMAIL_ALREADY_REGISTERED,
      "This email is already registered.",
      400
    );
  }

  res.status(200).json("success");
});

// VERIFY EMAIL AND SIGNUP
export const verifyEmailandSignup = tryCatch(
  async (req: Request, res: Response) => {
    const { email, fname, lname, mobileNumber, password, otp } = req.body;
    const dateNow = new Date(Date.now());

    if (!email || !fname || !lname || !mobileNumber || !password) {
      throw new AppError(
        EMAIL_DOES_NOT_EXIST,
        "Something went wrong please sign up again.",
        400
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      throw new AppError(
        EMAIL_ALREADY_REGISTERED,
        "This email is already registered.",
        400
      );
    }

    const userOtp = await Otp.findOne({ email });
    const hashedOtp = userOtp.otp;
    const expiredAt = userOtp.expiredAt;

    if (expiredAt < dateNow) {
      throw new AppError(OTP_ALREADY_EXPIRED, "OTP already expired.", 400);
    }

    const otpVerify = await bcrypt.compare(otp, hashedOtp);

    if (otpVerify === false) {
      throw new AppError(INVALID_OTP, "Invalid OTP.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fname,
      lname,
      verify: true,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    newUser.password = undefined;
    newUser.verify = undefined;

    res.status(201).json({ data: newUser, token });
  }
);

// READ OTP EXPIRY TIME
export const getOtpExpiry = async (req, res, next) => {
  const email = req.query.email;
  const otp = await Otp.findOne({ email });

  // if(!otp){
  //   throw new AppError()
  // }

  res.json(otp.expiredAt);
};

// GOOGLE LOGIN
export const googleLogin = tryCatch(async (req: Request, res: Response) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    throw new AppError(
      INVALID_OTP,
      "Email is not registered yet. Please register first.",
      400
    );
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {});

  user.password = undefined;
  user.verify = undefined;

  res.status(200).json({ data: user, token });
});

// LOGIN
export const login = tryCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    throw new AppError(
      INVALID_EMAIL_OR_PASSWORD,
      "Invalid email or password.",
      400
    );
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new AppError(
      INVALID_EMAIL_OR_PASSWORD,
      "Invalid email or password.",
      400
    );
  }

  const uid = user._id.toString();

  const token = jwt.sign({ id: uid }, process.env.JWT_SECRET, {});

  user.password = undefined;
  user.verify = undefined;

  res.status(200).json({ data: user, token });
});

// GET USER OWNED EVENT
export const getUserOwnedEvent = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const { id } = req.query;

    const validate = isValidObjectId(id);

    if (!validate) {
      throw new AppError(SOMETHING_WENT_WRONG, "Invalid id.", 400);
    }

    const userOwnedEvent = await User.findOne({
      _id: userId,
      product_owned: {
        $elemMatch: {
          _id: id,
        },
      },
    })
      .select("product_owned")
      .populate({
        path: "product_owned._id",
        select: "-prices -registered",
        populate: [{ path: "subjects._id" }, { path: "subjects.videos._id" }],
      });

    const user = await User.findOne({ _id: userId }).select("fname lname -_id");

    if (!userOwnedEvent) {
      throw new AppError(SOMETHING_WENT_WRONG, "Invalid id.", 400);
    }

    const findEvent = userOwnedEvent.product_owned.find(
      (e: any) => (e.id = id)
    );

    if (!findEvent) {
      throw new AppError(SOMETHING_WENT_WRONG, "Invalid id.", 400);
    }

    res.status(200).json({ eventData: findEvent, userData: user });
  }
);

// UPDATE USER
export const updateUser = tryCatch(async (req: Request, res: Response) => {
  const { fname, lname, mobileNumber, mName, agreement, userId } = req.body;

  console.log({ fname, lname, mobileNumber, mName, agreement, userId });

  if (!fname || !lname || !mobileNumber || !mName || !userId) {
    throw new AppError(
      SOMETHING_WENT_WRONG,
      "Credential expired. Please login in again.",
      400
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      SOMETHING_WENT_WRONG,
      "Credential expired. Please login in again.",
      400
    );
  }

  if (user) {
    user.fname = fname || user.fname;
    user.mname = mName || user.mname;
    user.lname = lname || user.lname;
    user.mobile_number = mobileNumber || user.mobile_number;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const updatedUser = await user.save();

    updatedUser.password = undefined;
    updatedUser.verify = undefined;

    res.status(200).json({ data: updatedUser, token });
  }
});
