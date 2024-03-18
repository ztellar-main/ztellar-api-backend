import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
    author_id:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    subject_id:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    video_url:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    }
})

const Video = mongoose.model('Video',videoSchema);

export default Video;