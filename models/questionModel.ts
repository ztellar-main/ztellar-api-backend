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
    },
  ],
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
