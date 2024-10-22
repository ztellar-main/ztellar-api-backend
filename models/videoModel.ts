import { timeStamp } from 'console';
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: String,
    product_id: mongoose.Schema.ObjectId,
    subject_id: mongoose.Schema.ObjectId,
    author_id: mongoose.Schema.ObjectId,
    video_url: String,
    duration: Number,
    video_url_converted: String,
    status: {
      type: Boolean,
      default: false,
    },
    video_public_url: String,
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
