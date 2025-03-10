import mongoose from 'mongoose';

const eventContestSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  occupation: {
    type: String,
    require: true,
  },
  company_organization: String,
  industry_experience: Number,
  school_name: String,
  degree_program: String,
  year_level: String,
  student_id_number: String,
  team: Boolean,
  team_name: String,
  team_mates: [
    {
      user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
      role: { type: String, require: true },
    },
  ],
  event: { type: mongoose.Types.ObjectId, ref: 'Product' },
});

const EventContestModel = mongoose.model(
  'eventContestSchema',
  eventContestSchema
);

export default EventContestModel;
