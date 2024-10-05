import mongoose from 'mongoose';
import Subject from './subjectModel';
import Video from './videoModel';
import Feedback from './feedbackModel';

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
      ref: 'User',
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
          ref: 'Subject',
        },
        videos: [
          {
            _id: {
              type: mongoose.Schema.ObjectId,
              ref: 'Video',
            },
          },
        ],
      },
    ],
    registered: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
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
        ref: 'Feedback',
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
    course_price: Number,
    converted_video_intro: String,
    course_subjects: [
      {
        data: {
          type: mongoose.Schema.ObjectId,
          ref: 'CourseSubject',
        },
        videos: [
          {
            data: {
              type: mongoose.Schema.ObjectId,
              ref: 'Video',
            },
          },
        ],
        questions: { type: mongoose.Schema.ObjectId, ref: 'Question' },
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
    sponsors_logo: [
      {
        sponsors_name: String,
        url: String,
      },
    ],
    sponsors_post: [
      {
        name: String,
        logo: String,
        post_data: [
          {
            url: String,
            file_type: String,
          },
        ],
      },
    ],
    sponsors_videos: [
      {
        name: String,
        logo: String,
        post_data: [
          {
            url: String,
            file_type: String,
          },
        ],
      },
    ],
    sponsors_boot: [
      {
        boot_legend: String,
        boor_message: String,
        file_letter_url: String,
        image_url: String,
        boot_list: [
          {
            boot_number: String,
            status: String,
            reserved_by: String,
            sold_to: String,
            prices: [
              {
                price_name: String,
                price: Number,
              },
            ],
          },
        ],
      },
    ],
    activate: {
      type: Boolean,
      default: false,
    },
    image_path: String,
    download_forms: [
      {
        url: String,
        title: String,
      },
    ],
  },

  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
