import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
   author_id : {
    type: String,
    required: true
   },
   course_id:{
    type: String,
    required: true
   },
   title:{
    type: String,
    required: true
   },
   course_title:{
      type: String,
      required: true
   },
   link:String
},{timestamps : true})

const Subject = mongoose.model('Subject',subjectSchema);

export default Subject