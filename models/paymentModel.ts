import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  product_type: String,
  product_id: { type: mongoose.Schema.ObjectId, ref: "Product" },
  reg_type: String,
  buyer_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  payment_mode: String,
  payment_source: String,
  base_amount: Number,
  less_amount: Number,
  author_payment: Number,
  ztellar_fee: Number,
},{timestamps:true});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
