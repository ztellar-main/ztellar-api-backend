import express from "express";
export const app = express();
import cors from "cors";
import "dotenv/config";
import sanitize from "express-mongo-sanitize";

import { Request, Response, NextFunction } from "express";
import errorHandler from "./middlewares/errorHandler";
import { STATUS_FAILED, STATUS_SUCCESS } from "./constants/statusCodes";

// body parser
app.use(express.json({ limit: "50mb" }));

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// sanitize data
app.use(sanitize());

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: STATUS_SUCCESS,
    message: "This is a message from testing api.",
  });
});

// routes
import userRoutes from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import paymongoRoutes from "./routes/paymongoRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";

app.use("/api/users", userRoutes);
app.use("/api/product", productRouter);
app.use("/api/paymongo", paymongoRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);

// error handler
app.use(errorHandler);

// route not found
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = `Route ${req.originalUrl} not found.`;
  res.status(404).json({
    status: STATUS_FAILED,
    message: err,
  });
});
