import express from "express";
const router = express.Router();

import { createPayment,createPaymentCashPayment } from "../controllers/paymentController";
import { protect } from "../utils/protect";

router.put("/create-payment", protect, createPayment);
router.put("/create-payment-cash-payment", createPaymentCashPayment);

export default router;
