import mongoose from 'mongoose';

const courseSubjectSchema = new mongoose.Schema(
  {
    title: String,
    course_id: mongoose.Schema.ObjectId,
  },
  { timestamps: true }
);

const CourseSubject = mongoose.model('CourseSubject', courseSubjectSchema);

export default CourseSubject;
