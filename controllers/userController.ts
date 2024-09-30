import User from '../models/userModel';
import { NextFunction, Request, Response } from 'express';
import { tryCatch } from '../utils/tryCatch';
import AppError from '../utils/AppError';
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
} from '../constants/errorCodes';
import { sendOtp } from '../utils/sendOtp';
import bcrypt from 'bcryptjs';
import Otp from '../models/otpModel';
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import Product from '../models/productModel';
import mongoose from 'mongoose';
import Payment from '../models/paymentModel';
import { sendEmail } from '../utils/sendEmail';

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// SEND OTP
export const sendOTp = tryCatch(async (req: Request, res: Response) => {
  const { email } = req.body;

  const emailValidate = EmailValidator.validate(email);

  if (!emailValidate) {
    throw new AppError(INVALID_EMAIL, 'Invalid email.', 400);
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new AppError(
      EMAIL_ALREADY_EXIST,
      'This email is already registered.',
      400
    );
  }

  // send otp
  const sentOtp = await sendOtp(email);

  if (!sentOtp) {
    throw new AppError(EMAIL_DID_NOT_SENT, 'Email did not sent.', 400);
  }

  res.status(200).json('success');
});

// GET EMAIL
export const getEmail = tryCatch(async (req: Request, res: Response) => {
  const { email } = req.body;

  const userEmail = await User.findOne({ email });

  if (userEmail) {
    throw new AppError(
      EMAIL_ALREADY_REGISTERED,
      'This email is already registered.',
      400
    );
  }

  res.status(200).json('success');
});

// VERIFY EMAIL AND SIGNUP
export const verifyEmailandSignup = tryCatch(
  async (req: Request, res: Response) => {
    const { email, fname, lname, mobileNumber, password, otp } = req.body;
    const dateNow = new Date(Date.now());

    if (!email || !fname || !lname || !mobileNumber || !password) {
      throw new AppError(
        EMAIL_DOES_NOT_EXIST,
        'Something went wrong please sign up again.',
        400
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      throw new AppError(
        EMAIL_ALREADY_REGISTERED,
        'This email is already registered.',
        400
      );
    }

    const userOtp = await Otp.findOne({ email });
    const hashedOtp = userOtp.otp;
    const expiredAt = userOtp.expiredAt;

    if (expiredAt < dateNow) {
      throw new AppError(OTP_ALREADY_EXPIRED, 'OTP already expired.', 400);
    }

    const otpVerify = await bcrypt.compare(otp, hashedOtp);

    if (otpVerify === false) {
      throw new AppError(INVALID_OTP, 'Invalid OTP.', 400);
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

// COMPANY VERIFY EMAIL AND SIGNUP
export const companyVerifyEmailandSignup = tryCatch(
  async (req: Request, res: Response) => {
    const { email, companyName, companyContactNumber, password, otp } =
      req.body;
    const dateNow = new Date(Date.now());

    if (!email || !companyName || !companyContactNumber || !password) {
      throw new AppError(
        EMAIL_DOES_NOT_EXIST,
        'Something went wrong please sign up again.',
        400
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      throw new AppError(
        EMAIL_ALREADY_REGISTERED,
        'This email is already registered.',
        400
      );
    }

    const userOtp = await Otp.findOne({ email });
    const hashedOtp = userOtp.otp;
    const expiredAt = userOtp.expiredAt;

    if (expiredAt < dateNow) {
      throw new AppError(OTP_ALREADY_EXPIRED, 'OTP already expired.', 400);
    }

    const otpVerify = await bcrypt.compare(otp, hashedOtp);

    if (otpVerify === false) {
      throw new AppError(INVALID_OTP, 'Invalid OTP.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = await User.create({
      email,
      password: hashedPassword,
      company_name: companyName,
      company_contact_number: companyContactNumber,
      verify: true,
      role: 'company',
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
      'Email is not registered yet. Please register first.',
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
      'Invalid email or password.',
      400
    );
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new AppError(
      INVALID_EMAIL_OR_PASSWORD,
      'Invalid email or password.',
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
    console.log(id);

    const validate = isValidObjectId(id);

    if (!validate) {
      throw new AppError(SOMETHING_WENT_WRONG, 'Invalid id.', 400);
    }

    const userOwnedEvent = await User.findOne({
      _id: userId,
    })
      .select('product_owned')
      .populate({
        path: 'product_owned._id',
        select: '-prices -registered',
        populate: [{ path: 'subjects._id' }, { path: 'subjects.videos._id' }],
      });

    const user = await User.findOne({ _id: userId }).select(
      'fname lname mname -_id'
    );

    if (!userOwnedEvent) {
      throw new AppError(SOMETHING_WENT_WRONG, 'Invalid id.', 400);
    }

    const findEvent = userOwnedEvent.product_owned.filter((e: any) => {
      const ownedId = e._id._id.toString();
      return ownedId === id;
    });

    if (!findEvent) {
      throw new AppError(SOMETHING_WENT_WRONG, 'Invalid id.', 400);
    }

    res.status(200).json({ eventData: findEvent, userData: user });
  }
);

// UPDATE USER
export const updateUser = tryCatch(async (req: Request, res: Response) => {
  const { fname, lname, mobileNumber, mName, agreement, userId } = req.body;

  // console.log({ fname, lname, mobileNumber, mName, agreement, userId });

  if (!fname || !lname || !mobileNumber || !mName || !userId) {
    throw new AppError(SOMETHING_WENT_WRONG, 'Please fill up all fields.', 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      SOMETHING_WENT_WRONG,
      'Credential expired. Please login in again.',
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

// RESET PASSWORD SEND OTP
export const resetPasswordSendOtp = tryCatch(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const emailValidate = EmailValidator.validate(email);

    if (!emailValidate) {
      throw new AppError(INVALID_EMAIL, 'Invalid email.', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(
        EMAIL_ALREADY_EXIST,
        'This email is not yet registered.',
        400
      );
    }

    // send otp
    const sentOtp = await sendOtp(email);

    if (!sentOtp) {
      throw new AppError(EMAIL_DID_NOT_SENT, 'Email did not sent.', 400);
    }

    res.status(200).json('success');
  }
);

// REST PASSWORD
export const resetPassword = tryCatch(async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  const dateNow = new Date(Date.now());

  const userOtp = await Otp.findOne({ email });
  const hashedOtp = userOtp.otp;
  const expiredAt = userOtp.expiredAt;

  if (expiredAt < dateNow) {
    throw new AppError(OTP_ALREADY_EXPIRED, 'OTP already expired.', 400);
  }

  const otpVerify = await bcrypt.compare(otp, hashedOtp);

  if (otpVerify === false) {
    throw new AppError(INVALID_OTP, 'Invalid OTP.', 400);
  }

  const user = await User.findOne({ email: email });

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword || user.password;

  const saveUser = await user.save();

  res.status(200).json('success');
});

// USER LIST
export const userList = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    let queryStr = JSON.stringify(req.query);

    let queryObj = JSON.parse(queryStr);

    const { email } = req.query;

    const e = email.toString();

    const a = new RegExp(e, 'i');

    queryObj.email = a;

    const users = await Product.findOne({
      _id: '6648503390c6701b9188f02e',
    }).populate({ path: 'registered._id' });

    res.status(200).json(users);
  }
);

// CHANGE PROFILE PICTURE
export const changeProfilePic = tryCatch(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const userId = req.user;
    const imageUrl = req.body.imageUrl;

    let user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError(SOMETHING_WENT_WRONG, 'Please login', 400);
    }

    user.avatar = imageUrl || user.avatar;

    const saveImage = await user.save();
    saveImage.password = undefined;

    res.status(200).json(saveImage);
  }
);

// AUTHOR SUM AND TOTAL
export const authorSumTotal = tryCatch(async (req: Request, res: Response) => {
  const productId = '6647f177f0cc04f6055fb3f6';
  const jpsmeId = '6648503390c6701b9188f02e';

  const PSME = await Payment.find({
    product_id: productId,
  });

  const JPSME = await Payment.find({
    product_id: jpsmeId,
  });

  res.json({ PSME, JPSME });
});

export const getUserForLoginUpdate = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.query;

    const user = await User.findOne({
      _id: id,
    }).select('fname mname lname mobile_number');

    if (!user) {
      throw new AppError(SOMETHING_WENT_WRONG, 'Please login again.', 400);
    }

    res.status(200).json(user);
  }
);

export const getUser = tryCatch(async (req: Request, res: Response) => {
  const userId = req.body.userId;

  // console.log(userId)
  // console.log("sample")

  const user = await User.findOne({ _id: userId });

  console.log(user);

  if (!user) {
    throw new AppError(
      SOMETHING_WENT_WRONG,
      'User id is invalid or not yet registered.',
      400
    );
  }

  res.status(200).json({ message: 'success' });
});

export const updateProfilePicAll = tryCatch(
  async (req: Request, res: Response) => {
    const updatedUser = await User.updateMany(
      {},
      {
        $set: {
          avatar:
            'https://firebasestorage.googleapis.com/v0/b/ztellar-11a4f.appspot.com/o/ztellar%2FGroup%20208%201.png?alt=media&token=990404ef-455b-46fa-b495-4589da03a5a8',
        },
      },
      { new: true }
    );

    res.json(updatedUser);
  }
);

// sponsor reserve and send email
export const sponsorReserveAndSendEmail = tryCatch(
  async (req: Request, res: Response) => {
    const {
      productId,
      senderEmail,
      eventTitle,
      bootNumber,
      sponsorType,
      sponsorPrice,
      bootId,
    } = req.body;

    sendEmail(
      'denverbigayan1@gmail.com',
      senderEmail,
      eventTitle,
      bootNumber,
      sponsorType,
      sponsorPrice
    );

    const productData = await Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $set: { 'sponsors_boot.$[e1].boot_list.$[e2].status': 'Reserved' },
      },
      {
        arrayFilters: [
          { 'e1._id': '66bd9a33440a4a846164555e' },
          { 'e2._id': bootId },
        ],
        new: true,
      }
    );

    res.json(productData);
  }
);
