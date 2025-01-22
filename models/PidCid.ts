import mongoose from 'mongoose';

const pidcidSchema = new mongoose.Schema({
  cid: {
    type: String,
    required: true,
  },
  pid: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Pidcid = mongoose.model('Pidcid', pidcidSchema);

export default Pidcid;
