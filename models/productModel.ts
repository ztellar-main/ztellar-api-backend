import mongoose from 'mongoose';
import Subject from './subjectModel';
import Video from './videoModel';
import Feedback from './feedbackModel';

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    access_users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
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
        expiry: Date,
        qr_code: String,
        reg_type: String,
        product_type: String,
        author_payment: Number,
        ztellar_fee: Number,
        payment_mode: String,
        pass: {
          type: Boolean,
          default: false,
        },
        date: {
          type: Date,
          default: Date.now(),
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
    sponsors_boot: {
      booth_image: String,
      booth_file: String,
      booths: [
        {
          booth_name: String,
          booth_type: String,
          booth_price: Number,
          booth_status: {
            type: String,
            default: 'Available',
          },
          // INFO FROM SPONSOR
          reserved_company_name: String,
          reserve_company_address: String,
          reserve_tin_number: String,
          reserve_company_contact: String,
          reserve_mainline_business: String,
          reserve_contact_person: String,
          reserve_solicitor: String,
          booth_status_update_logs: [
            {
              user_id: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
              },
              email: String,
              date: {
                type: Date,
                default: Date.now(),
              },
              booth_status_value: String,
            },
          ],
        },
      ],
    },
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
    pay_rate: {
      rate_type: String,
      value: Number,
    },
    transaction: {
      transaction_type: String,
      value: String,
    },
    live_access_id: String,
    coursePrices: [
      {
        price: Number,
        months: Number,
      },
    ],
    course_certificate_properties: {
      left: Number,
      top: Number,
      font: Number,
      image: String,
    },
    cash_payment_details: [
      {
        cash_type: String,
        price: Number,
      },
    ],
    event_certificate_data: [
      {
        title: String,
        top: String,
        left: String,
        font: String,
        image_url: String,
        font_color: String,
        reg_type: String,
      },
    ],
    event_certificate_download_date: Date,
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
