import mongoose from 'mongoose'

const mongopaySchema = new mongoose.Schema({
    checkout_id: String,
    payment_intent_id: String,
    payment_description: String,
    full_payment:Number,
    base_payment:Number,
    statement_descriptor:String,
    payment_method:String
},{ timestamps: true })

const Mongopay = mongoose.model('Mongopay',mongopaySchema)

export default Mongopay
