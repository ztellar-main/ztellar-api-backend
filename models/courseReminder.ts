import mongoose from 'mongoose';

const courseReminderSchema = new mongoose.Schema({
  hours: {
    type: Number,
    require: true,
  },
  minutes: {
    type: Number,
    require: true,
  },
  name: String,
  course_title: String,
  days: [
    {
      type: String,
    },
  ],
  email: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  exp: Date,
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  course_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
  },
});

const CourseReminders = mongoose.model('courseReminder', courseReminderSchema);

export default CourseReminders;
