import mongoose from 'mongoose';

const sampleVideoSchema = new mongoose.Schema({
    title:String,
    video_url:String
});

const Sample = mongoose.model('Sample',sampleVideoSchema)

export default Sample