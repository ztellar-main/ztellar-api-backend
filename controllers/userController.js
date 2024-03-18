import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import {sendOtp} from './otp_controller.js'
import Otp from '../models/otp_model.js';
import bcrypt from 'bcrypt';
import validator from 'email-validator'
import createToken from '../utils/createToken.js';
import protect from '../utils/protect.js';

// @desc Register a new user
// route POST /api/users
// @access Public
export const registerUser = asyncHandler(async(req,res) => {
    const {email} = req.body;

    const userExist  = await User.findOne({email});

    if(userExist){
        res.status(404);
        throw new Error('User already exist.');
    }

    const user = await User.create(req.body);

    if(user){
        generateToken(res, user._id);
        res.status(201).json(user);
    }else{
        res.status(400);
        throw new Error('Invalid user data.')
    }
});


// @desc Auth user/ set token
// route POST /api/users/auth
// @access Public
export const authUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body;

    let user = await User.findOne({email});

    // console.log(user)

    if(user){
        // generateToken(res, user._id);
        const token = createToken(user._id);

        const passwordVerify = await bcrypt.compare(password,user.password);

        if(!passwordVerify){
            res.status(401);
            throw new Error('Invalid email or password.');
        }

        user.password = undefined;
        res.status(200).json({
            data: user,
            token:token
        });


    }else{
        res.status(401);
        throw new Error('Invalid email or password.');
    }
});

// @desc Logout user
// route POST /api/users/logout
// @access Public
export const logoutUser = asyncHandler(async(req,res) => {
    res.cookie('jwt','',{
        httpOnly:true,
        expires: new Date(0)
    });

    res.status(200).json({message:'User logged out.'})
});

// @desc Get user profile
// route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async(req,res) => {
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
    const userx = await User.findById(user._id)
    res.status(200).json(userx);
});

// @desc Update user profile
// route PUT /api/users/profile
// @access Private
export const updateUserProfile = asyncHandler(async(req,res) => {
    const token = req.body.token

    const userx = await protect(token)

    if(userx === 'Not authorized, no token'){
      res.status(401).json(userx)
      return
    }
      
    if(userx === 'Not authorized, invalid token'){
      res.status(401).json(userx)
      return
    }

    const user = await User.findById(userx._id);

    if(user){
        user.fname = req.body.fname || user.fname;
        user.mname = req.body.mname || user.mname;
        user.lname = req.body.lname || user.lname;
        user.username = req.body.username || user.username;


        if(req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        updatedUser.password = undefined

        res.status(200).json(updatedUser)
    }else{
        res.status(404);
        throw new Error('User not found.');
    }
});

// GOOGLE SIGNUP AND LOGIN
export const googleLogin = async(req,res,next) => {
    const email = req.body.email;
    const user = await User.findOne({email});

    console.log(email)

    if(!user || user.verify === false){
        try{
            return sendOtp(email,res);
        }catch(err){
            return res.status(404).json(err)
        }
    }

    user.pass = undefined;
    const token = createToken(user._id)
    res.status(200).json({
        data:user,
        status:'success',
        token
    })
    
}

// READ OTP EXPIRY TIME
export const getOtpExpiry = async(req,res,next) => {
    const email = req.query.email;
    const otp = await Otp.find({email});

    res.json(otp);
}

// RESEND OTP
export const ResendOtp = async(req,res,next) => {
    const email = req.body.email;
    if(!email){
        return res.status(404).json('Something went wrong please signup again.')
    }
    sendOtp(email,res)
  }

  // VERIFY EMAIL THEN SIGNUP
export const verifyEmailAndsignup = async(req,res,next) => {
    try{
        const email = req.body.email
        const pass = req.body.pass
        const otp = req.body.otp


        const userOtp = await Otp.find({email});

        const iserOtpLength = Number(userOtp.length);
        const hashedOtp = userOtp[0].otp
        const expiredAt = userOtp[0].expiredAt

        const userCheck = await User.find({email})
        const userCheckNumber = Number(userCheck.length); 

        // OTP ERROR HANDLER
        if(userCheckNumber > 0){
            return res.status(404).json('Email is already registered.')
        }

        if(!email){
            return res.status(404).json('Something went wrong please sign up again.')
        }

        if(iserOtpLength === 0){
            return res.status(404).json('Something went wrong please sign up again.')
        }

        if(!otp){
            return res.status(404).json('Please Enter Otp.')
        }

        if(expiredAt < Date.now()){
            return res.status(404).json('Otp is expired.')
        }

        const otpVerify = await bcrypt.compare(otp, hashedOtp);

        if(otpVerify === false){
            return res.status(404).json('Invalid Otp');
        }

        // SIGNUP
        // const HashedPassword = await bcrypt.hash(pass, 10)



        let new_user = await User.create({
            email,
            password:pass || 'asdasdasd',
            login_type:'google',
            verify: true
        });

        new_user.password = undefined;
        const token = createToken(new_user._id)
        res.status(201).json({
            data:new_user,
            status:'success',
            token
        })

    }catch(err){
        return res.status(404).json(err);
    }
}

// NORMAL SIGNUP
export const checkEmail = async(req,res,next) => {
    const email = req.body.email;
    const pass = req.body.pass;
    const passConfirm  = req.body.passConfirm;

    const passCount = Number(pass.length);

    const user = await User.findOne({email});

    if(user == 'google') return res.status(404).json('Account is already registered. try to Login using the google login button.')

    if(!email || !pass || !passConfirm){
        return res.status(404).json('Please fill up all the fields.')
    }

    if(!validator.validate(email)){
        return res.status(404).json('Email is Invalid.')
    }

    if(user){
        return res.status(404).json('Email already registered.')
    }

    if(passCount < 8){
        return res.status(404).json('Password must be 8 or more than characters.')
    }

    if(pass !== passConfirm){
        return res.status(404).json('Password are not the same.')
    }

    sendOtp(email,res);
}


