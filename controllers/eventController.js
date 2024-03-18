import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose'
import protect from '../utils/protect.js';

export const getOwnedSingleEvent = asyncHandler(async(req,res,next) => {
    const token = req.query.token

    const user = await protect(token)

    if(user === 'Not authorized, no token'){
      res.status(401).json(user)
      return
    }
      
    if(user === 'Not authorized, invalid token'){
      res.status(401).json(user)
      return
    }

    const userId = user._id;
    const eventId = req.query.eventId;

    const time = new Date(Date.now()).getTime();

    try{
        const eventId_mongoose = new mongoose.Types.ObjectId(eventId);



        const event = await Course.findOne({
            _id: eventId_mongoose
        }).select('-registered -feedback')
    
        res.json(event)
    }catch(err){
        res.status(404).json(err)
    }
})