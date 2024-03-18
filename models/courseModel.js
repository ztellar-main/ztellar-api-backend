import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    author_id:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    author_name:String,
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
    },
    image_url:{
        type:String
    },
    video_url:{
        type:String
    },
    subjects:[
        {
            _id:{
                type:mongoose.Schema.ObjectId,
                ref:'Subject'
            },
            videos:[{
                type: mongoose.Schema.ObjectId,
                ref:'Video'
            }]
        }
    ],
    status:{
        type:Boolean,
        required:true,
        default:false
    },
    feedback:[{
        type:mongoose.Schema.ObjectId,
        ref:'Feedback'
        
    }],
    feedback_count: {
        type:Number,
        default:0
    },
    average_rating: {
        type: Number,
        default:0
    },
    type:{
        type:String,
        default:'Course'
    },
    activate:{
        type:Boolean,
        required:true,
        default:true
    },
    approved:{
        type:Boolean,
        required:true,
        default:true
    },
    registered:[{
        _id:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
        },
        qr_code:String 
    }],
    date_from:Date,
    date_to:Date,
    place:String,
    f2f_price:Number,
    virtual_price:Number,
    JPSME_price:Number

}, { timestamps: true })

const Course = mongoose.model('Course',courseSchema)

export default Course