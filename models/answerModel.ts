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
  question_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
  },
  course_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  subject_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseSubject',
  },
  score: {
    type: Number,
    default: 0,
  },
  passing_rate: {
    type: Number,
    default: 0.75,
  },
  quiz_length: Number,
  passed: { type: Boolean, default: false },
  time_expired: Date,
  minutes_per_question: {
    type: Number,
    default: 1,
  },
  answers: [
    {
      correct: Boolean,
      answer: String,
      correct_answer: String,
      question: String,
      choices: [
        {
          label: String,
          description: String,
        },
      ],
    },
  ],
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
