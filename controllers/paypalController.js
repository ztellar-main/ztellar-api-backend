import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import Course from '../models/courseModel.js'
import protect from '../utils/protect.js';

// PAYPAL BUY FUNCTION
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET} = process.env;
const base = "https://api-m.sandbox.paypal.com";

const generateAccessToken = async () => {
    try {
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
      ).toString("base64");
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }
};

// CREATE ORDER FUNCTION
const createOrder = async (data) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "PHP",
            value: data.price,
            description: data.title
          },
        },
      ],
    };
    try{
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
      });
      return handleResponse(response);
    }catch(err){
      console.log(err)
    }

  };

  // CAPTURE ORDER FUNCTION
  const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
    try{
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response

    }catch(err){
      console.log(err)
    }
    
    }

    async function handleResponse(response) {
        try {
          const jsonResponse = await response.json();
          return {
            jsonResponse,
            httpStatusCode: response.status,
          };
        } catch (err) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      }
      
      // CREATE ORDER CONTROLLER
      export const createOrderCon = asyncHandler(async (req, res) => {

        try {
          console.log(req.body.product)
          
          const { jsonResponse, httpStatusCode } = await createOrder(req.body.product);
          res.status(httpStatusCode).json(jsonResponse);
        } catch (error) {
          console.error("Failed to create order:", error);
          res.status(500).json({ error: "Failed to create order." });
        }
      });
      // CAPTURE ORDER CONTROLLER
      export const captureOrderCon = asyncHandler(async (req, res) => {
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
        try {
        
        const registrationType = req.body.regType
        console.log(registrationType)
        const orderID = req.body.orderID
        const result  = await captureOrder(orderID);
        const userId = userx._id
        const time = new Date(Date.now()).getTime();

        const eventId_mongoose = new mongoose.Types.ObjectId(process.env.EVENT_ID)
        const userId_mongoose = new mongoose.Types.ObjectId(userId)
        const courseId_mongoose = new mongoose.Types.ObjectId(req.body.productId)
        //   UPDATE DATABASE HERE
        try{
          const userUpdate = await User.findByIdAndUpdate(
            {_id:userId},
            {$push: {course_owned: {_id: courseId_mongoose}}},
            {new:true,upsert:true}
          )
          const eventUpdateUser = await User.findByIdAndUpdate(
            {_id:userId},
            {
              $push: {course_owned: {_id: eventId_mongoose,qr_code:`${userId}${time}`,reg_type:registrationType }},
            },
            {new:true,upsert:true}
        )
          const courseUpdate = await Course.findByIdAndUpdate(
            {_id:req.body.productId},
            {
              $push: {registered: {_id: userId_mongoose}}},
            {new:true,upsert:true}
          )

          const eventUpdate = await Course.findByIdAndUpdate(
            {_id: process.env.EVENT_ID},
            {$push: {registered: {_id:userId_mongoose,qr_code:`${userId}${time}`,reg_type: registrationType}}},
            {new:true,upsert:true}
          )

          res.status(200).json({
            message:'success',
            userUpdate:eventUpdateUser,
            courseUpdate:courseUpdate
          });
        }catch(err){
          res.status(404).json('SOMETHING WENT WRONG')
        }
        
        } catch (error) {
          console.error("Failed to create order:", error);
          res.status(500).json({ error: "Failed to capture order."   });
        }
      });



