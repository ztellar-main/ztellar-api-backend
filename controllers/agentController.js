import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';

export const CheckIfUserExistUsingEmail = asyncHandler(async(req,res,next) => {
    try{
        const {email} = req.body;

        const user = await User.findOne({email:email})

        if(!user){
            res.status(404).json('This email is not registered.')
            return
        }

        res.json({
            message:'success',
            data:user
        })
    }catch(err){
        res.status(404).json('SOMETHING WENT WRONG. PLEASE TRY AGAIN')
    }
})

export const checkProductIfexist = asyncHandler(async(req,res,next) => {
    const {productId} = req.body;
    try{
        const product = await Course.find({
            _id:productId
        })

        if(Number(product.length) === 0){
            res.status(404).json('INVALID RECEIPT DESCRIPTION')
            return
        }

        res.json(product)
    }catch(err){
        res.status(404).json('INVALID RECEIPT DESCRIPTION')
    }
})

export const saveProductToUser = asyncHandler(async(req,res,next) => {
    
})

