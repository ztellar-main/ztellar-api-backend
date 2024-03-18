import asyncHandler from 'express-async-handler';
import Payment from '../models/paymentModel.js';
import protect from '../utils/protect.js';

export const paymentSave = asyncHandler(async(req,res,next) => {
    const token = req.body.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }
    req.body.buyer_id = user._id
    
    try{
        const payment = await Payment.create(req.body)
        res.json(payment)
    }catch(err){
        res.status(404).json(err)
    }
})