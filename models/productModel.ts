import mongoose from "mongoose";
import Subject from "./subjectModel";
import Video from "./videoModel";
import Feedback from "./feedbackModel";

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    prices: [
      {
        priceType: String,
        priceName: String,
        price: Number,
      },
    ],
    author_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    liveId: String,
    place: String,
    image_url: String,
    video_url: String,
    type: String,
    approved: {
      type: Boolean,
      default: false,
    },
    subjects: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: "Subject",
        },
        videos: [
          {
            _id: {
              type: mongoose.Schema.ObjectId,
              ref: "Video",
            },
          },
        ],
      },
    ],
    registered: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        qr_code: String,
        reg_type: String,
        product_type: String,
        pass: {
          type: Boolean,
          default: false,
        },
      },
    ],
    feedback: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Feedback",
      },
    ],
    feedback_count: {
      type: Number,
      default: 0,
    },
    average_rating: {
      type: Number,
      default: 0,
    },
    attendance: [
      {
        title: String,
        link: String,
      },
    ],
    quiz: [
      {
        title: String,
        subtitle: String,
        speaker: String,
        link: String,
      },
    ],
    certificate: [
      {
        align_items: String,
        top: String,
        width: String,
        orientation: String,
        size: String,
        image_src: String,
        margin_left: String,
        certificate_name: String,
      },
    ],
    // COURSE
    course_price: {
      price_description: String,
      price_value: Number,
    },
    course_subjects: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: "CourseSubject",
        },
        video: [
          {
            _id: {
              type: mongoose.Schema.ObjectId,
              ref: "CourseVideo",
            },
          },
        ],
      },
    ],
    date_start: Date,
    date_end: Date,
    questions: [
      {
        question: String,
        choices: [
          {
            label: String,
            description: String,
          },
        ],
        answer: String,
        time: {
          type: Number,
          default: 5,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
