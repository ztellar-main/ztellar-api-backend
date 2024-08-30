import express from 'express';
export const app = express();
import cors from 'cors';
import 'dotenv/config';
import sanitize from 'express-mongo-sanitize';
import http from 'http';
import { Server } from 'socket.io';

import { Request, Response, NextFunction } from 'express';
import errorHandler from './middlewares/errorHandler';
import { STATUS_FAILED, STATUS_SUCCESS } from './constants/statusCodes';
import path from 'path';

// body parser
app.use(express.json({ limit: '50mb' }));
app.use('/static', express.static(path.join(__dirname, 'public')));

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// sanitize data
app.use(sanitize());

export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: 'https://ztellar.tech',
  },
});

export const socketIo = io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('join_room', (data) => {
    console.log(data);
    socket.join(data);
  });

  // Avoid adding multiple listeners
  socket.once('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// testing api
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: STATUS_SUCCESS,
    message: 'This is a message from testing api.',
  });
});

// routes
import userRoutes from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import paymongoRoutes from './routes/paymongoRoutes';
import paymentRoutes from './routes/paymentRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import User from './models/userModel';
import privateVideoRoutes from './routes/privateVideoRoutes';
import authorRoutes from './routes/authorRoutes';
import courseRoutes from './routes/courseRoutes';
import convertVideoRoutes from './routes/convertVideoRoutes';

app.use('/api/users', userRoutes);
app.use('/api/product', productRouter);
app.use('/api/paymongo', paymongoRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/private-video', privateVideoRoutes);
app.use('/api/author', authorRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/video', convertVideoRoutes);

// error handler
app.use(errorHandler);

// route not found
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = `Route ${req.originalUrl} not found.`;
  res.status(404).json({
    status: STATUS_FAILED,
    message: err,
  });
});
