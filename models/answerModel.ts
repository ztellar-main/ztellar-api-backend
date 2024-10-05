import mongoose from 'mongoose';
const answerSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: false,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  course_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  subject_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseSubject',
  },
  answers: [
    {
      correct: Boolean,
      answer: String,
    },
  ],
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
