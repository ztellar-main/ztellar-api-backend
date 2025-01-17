import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  topic: { type: String, required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  joinUrl: { type: String, required: true },
  createdBy: { type: String, required: true }, // Admin email
  admin_url: String,
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
});

const ZoomMeeting = mongoose.model('Meeting', meetingSchema);

export default ZoomMeeting;
