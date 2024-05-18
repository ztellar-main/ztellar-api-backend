import express from "express";
const router = express.Router();

import { createPayment } from "../controllers/paymentController";
import { protect } from "../utils/protect";

router.put("/create-payment", protect, createPayment);

export default router;
