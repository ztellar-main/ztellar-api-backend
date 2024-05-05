import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import fetch from 'node-fetch'

// MONGODB CONNECT
connectDB()

const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:["https://ztellar-7rf8.onrender.com","https://ztellar.tech","http://localhost:3000"],
    credentials:true
}));

// ROUTES
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js'
import cloudinaryRoutes from './routes/cloudinaryRoutes.js'
import paypalRoutes from './routes/paypalRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import paymongoRoutes from './routes/paymongoRoutes.js'
import agentRoutes from './routes/agentRoutes.js'


app.use('/api/users',userRoutes);
app.use('/api/course',courseRoutes)
app.use('/api/cloudinary',cloudinaryRoutes)
app.use('/api/paypal',paypalRoutes)
app.use('/api/feedback',feedbackRoutes)
app.use('/api/event',eventRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/paymongo',paymongoRoutes)
app.use('/api/agent',agentRoutes)

app.get('',(req,res) => res.send('Server is ready.'));


// ERROR MIDDLEWARES
app.use(notFound);
app.use(errorHandler);

app.listen(port,() => {
    console.log(`Server is running at port ${port}.`);
})
