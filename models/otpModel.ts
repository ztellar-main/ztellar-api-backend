import mongoose from 'mongoose'



const otp_schema = new mongoose.Schema({
    email:String,
    otp:String,
    createdAt:Date,
    expiredAt:Date
})

const Otp = mongoose.model('Otp',otp_schema)

export default Otp