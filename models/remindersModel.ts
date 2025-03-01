import mongoose from 'mongoose';
const now = new Date();
const expiresAt = new Date(now.setMonth(now.getMonth() + 1));

const reminderSchema = new mongoose.Schema({
  hours: {
    type: Number,
    require: true,
  },
  minutes: {
    type: Number,
    require: true,
  },
  days: [
    {
      type: String,
    },
  ],
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  exp: Date,
});

const Reminders = mongoose.model('Reminder', reminderSchema);

export default Reminders;
