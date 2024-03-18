import asyncHandler from 'express-async-handler';
import Mongopay from '../models/paymongoModel.js';
import Payment from '../models/paymentModel.js';
import mongoose from 'mongoose'
import User from '../models/userModel.js'
import Course from '../models/courseModel.js'
import protect from '../utils/protect.js';

// CREATE MONGOPAY PAYMENT RECORD
export const createMongopayPayment = asyncHandler(async(req,res,next) => {
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
    // SAVE TO PAYMONGO MODEL
    try{
        const savePaymongo = await Mongopay.create({
            checkout_id: req.body.checkout_id,
            payment_intent_id: req.body.payment_intent_id,
            payment_description: req.body.payment_description,
            full_payment: req.body.fullPayment,
            base_payment: req.body.basePayment,
            statement_descriptor: req.body.statement_descriptor,
            payment_method: req.body.payment_method
        });
        try{
            // SAVE PAYMENT
            const prodouctId = new mongoose.Types.ObjectId(req.body.productId)
            const savePayment = await Payment.create({
                product_id: prodouctId,
                full_payment: req.body.fullPayment,
                base_payment: req.body.basePayment,
                payment_mode: req.body.payment_method,
                buyer_id: req.body.buyerId,
                product_owner_id: req.body.productOwnerId,
                product_type: req.body.productType,
                owner_payment: req.body.ownerPayment,
                fee: req.body.fee,
                payment_id: req.body.payment_intent_id,
            })
            // res.status(200).json({
            //     data1: savePaymongo,
            //     data2: savePayment
            // })
            try{
                const time = new Date(Date.now()).getTime();
                const userId = user._id
                const eventId_mongoose = new mongoose.Types.ObjectId(process.env.EVENT_ID)
                const userId_mongoose = new mongoose.Types.ObjectId(userId)
                const courseId_mongoose = new mongoose.Types.ObjectId(req.body.productId)
                
                
                // UPDATE USER PRODUCT OWNED - COURSE
                const userUpdate = await User.findByIdAndUpdate(
                    {_id:userId},
                    {$push: {course_owned: {_id: courseId_mongoose}}},
                    {new:true,upsert:true}
                )
                // 
                try{
                    const eventUpdateUser = await User.findByIdAndUpdate(
                        {_id:userId},
                        {
                          $push: {course_owned: {_id: eventId_mongoose,qr_code:`${userId}${time}`,reg_type: req.body.regType}},
                        },
                        {new:true,upsert:true}
                    )
                    try{
                        const courseUpdate = await Course.findByIdAndUpdate(
                            {_id: req.body.productId},
                            {
                              $push: {registered: {_id: userId_mongoose}}},
                            {new:true,upsert:true}
                          )
                          try{
                            const eventUpdate = await Course.findByIdAndUpdate(
                                {_id: process.env.EVENT_ID},
                                {$push: {registered: {_id:userId_mongoose,qr_code:`${userId}${time}`,reg_type: req.body.regType}}},
                                {new:true,upsert:true}
                              )
        
                              res.status(200).json({
                                data1: savePaymongo,
                                data2: savePayment,
                                data3: userUpdate,
                                data4: eventUpdateUser,
                                data5: courseUpdate,
                                data6: eventUpdate,
                                message: 'success'
                            })
                          }catch(err){
                            res.status(404).json('SOMTHING WENT WRONG 4');
                          }
                    }catch(err){
                        res.status(404).json('SOMTHING WENT WRONG 3');
                    }
                }catch(err){
                    res.status(404).json('SOMTHING WENT WRONG 2');
                }
            }catch(err){
                res.status(404).json('SOMTHING WENT WRONG 1');
            }
            
        }catch(err){
            res.status(404).json('SOMTHING WENT WRONG 6');
        }
    }catch(err){
        res.status(404).json('SOMTHING WENT WRONG 5');
    }


    
})