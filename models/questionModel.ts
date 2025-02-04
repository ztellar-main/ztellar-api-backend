import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questions: [
    {
      question: String,
      answer: String,
      id: Number,
      choices: [
        {
          choiceId: Number,
          label: String,
          description: String,
        },
      ],
      time_per_question_in_minutes: {
        type: Number,
        default: 1,
      },
    },
  ],
  time_per_question_in_minutes: {
    type: Number,
    default: 5,
  },
  passing_rate: {
    type: Number,
    default: 0.75,
  },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
