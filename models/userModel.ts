import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { validate } from "email-validator";
import Product from "./productModel";
import Subject from "./subjectModel";
import Video from "./videoModel";
import Feedback from "./feedbackModel";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validate, "Invalid email."],
      required: [true, "Please enter your email."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      minlength: [8, "Password must be atleast 6 characters"],
    },
    fname: String,
    mname: String,
    lname: String,
    mobile_number: Number,
    avatar: {
      type: String,
      default: "ztellar/ztellar/pzoz9wj3y3onkg62dcdx",
    },
    role: {
      type: String,
      default: "member",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    product_owned: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        qr_code: String,
        reg_type: String,
        product_type: String,
      },
    ],
    fully_verify: {
      type: Boolean,
      default: false,
    },
    pass: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
