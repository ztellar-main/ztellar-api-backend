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
        subtitle:String,
        speaker:String,
        link: String,
      },
    ],
  },

  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
