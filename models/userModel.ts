import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { validate } from 'email-validator';
import Product from './productModel';
import Subject from './subjectModel';
import Video from './videoModel';
import Feedback from './feedbackModel';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validate, 'Invalid email.'],
      required: [true, 'Please enter your email.'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password.'],
      minlength: [8, 'Password must be atleast 6 characters'],
    },
    fname: String,
    mname: String,
    lname: String,
    mobile_number: Number,
    avatar: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/ztellar-11a4f.appspot.com/o/ztellar%2FGroup%20208%201.png?alt=media&token=990404ef-455b-46fa-b495-4589da03a5a8',
    },
    role: {
      type: String,
      default: 'member',
    },
    verify: {
      type: Boolean,
      default: false,
    },
    product_owned: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
        recent_clicked: {
          component: String,
          subject: {
            subjectId: String,
            subjectTitle: String,
            subjectMainId: String,
          },
          quizId: String,
          video: {
            videoTitle: String,
            videoUrl: String,
            videoId: String,
          },
        },
        qr_code: String,
        reg_type: String,
        product_type: String,
        expiry: Date,
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
    // NEW
    answers: [
      {
        product_id: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
        answers: [
          {
            number: Number,
            answer: String,
            correct: Boolean,
          },
        ],
        score: Number,
        finished: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // COMPANY
    company_name: String,
    company_contact_number: Number,
    recent_course_clicked: [
      {
        course_id: { type: mongoose.Schema.ObjectId, ref: 'Product' },
        recent: {
          subjectIndex: Number,
          videoIndex: Number,
          stateType: String,
          subjectId: String,
        },
      },
    ],
    author_event_balance: {
      type: Number,
      default: 0,
    },
    bank_name: String,
    bank_account_name: String,
    bank_account_number: String,
    business_type: String,
    tin: String,
    company_registration_number: String,
    landline: String,
    company_address: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
