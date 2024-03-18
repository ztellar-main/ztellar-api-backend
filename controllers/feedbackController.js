import Course from "../models/courseModel.js";
import Feedback from "../models/feedbackModel.js";
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'
import protect from "../utils/protect.js";

// CREATE FEEDBACK
export const createFeedBack = asyncHandler(async(req,res,next) => {
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


    const {comment,rating,productId,type} = req.body;
    const userId = user._id

    console.log({comment,rating,productId})

    if(!comment || !rating || !productId){
        res.status(404);
        throw new Error('Missing credentials.')
    }

    req.body.product_id = productId;
    req.body.user = userId

    const userId_mongoose = new mongoose.Types.ObjectId(userId);

    const findUser = await Feedback.find({
        product_id: productId,
        user: userId_mongoose
    })

    if(Number(findUser.length) > 0){
        res.status(404)
        throw new Error('You have already leave your feedback. Please refresh the page.')
    }

    // CREATE FEEDBACK
    try{
        const newFeedback = await Feedback.create(req.body);
            // SAVE TO PRODUCT
            try{
                const saveToProduct = await Course.findOneAndUpdate(
                    {_id: productId},
                    {$push: {feedback : {_id: newFeedback._id}}},
                    {new:true,upsert:true}
                );
                // UPDATE FEEDBACK COUNT
                try{
                    const updateFeedbackCount = await Course.findOneAndUpdate(
                        {_id: productId},
                        {$inc: {feedback_count: 1}}
                    );
                    // FIND FEEDBACKS
                    try{
                        const getFeedbacks = await Feedback.find({product_id:productId});

                        const sum = getFeedbacks.reduce((accumulator, object) => {
                            return accumulator + object.rating
                        }, 0);
                        
                        const ratings_average = sum/getFeedbacks.length;
                    
                        // UPDATE RATING AVERAGE
                        const updateRatingAverage = await Course.findOneAndUpdate(
                            {_id: productId},
                            {$set: {average_rating: ratings_average}}
                        );
                    
                        res.json(updateRatingAverage);
                    }catch(err){
                        next()
                    }
                }catch(err){
                    next()
                }    
            }catch(err){
                next()
            }
    }catch(err){
        next()
    }

})