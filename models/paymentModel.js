import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.ObjectId,
        ref:"Course"
    },
    full_payment:{
        type:Number
    },
    base_payment:Number,
    payment_mode:{
        type:'String'
    },
    buyer_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    product_owner_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    product_type:{
        type:String
    },
    owner_payment:{
        type:Number
    },
    fee:{
        type:Number
    },
    order_id:String,
    payer_id:String,
    payment_id:String,
    facilitator_access_token:String
},{
    timestamps:true
});

const Payment = mongoose.model('Payment',paymentSchema)

export default Payment