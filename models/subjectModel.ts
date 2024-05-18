import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    title: String,
    link: String,
    product_id: mongoose.Schema.ObjectId,
    author_id: mongoose.Schema.ObjectId,
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
