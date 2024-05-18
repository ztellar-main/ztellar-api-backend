import { timeStamp } from "console";
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: String,
    product_id: mongoose.Schema.ObjectId,
    subject_id: mongoose.Schema.ObjectId,
    author_id: mongoose.Schema.ObjectId,
    video_url:String,
    duration: Number,
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
