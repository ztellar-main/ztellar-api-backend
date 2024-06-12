import express from "express";
const router = express.Router();

import { createPayment,createPaymentCashPayment,createCashPayment } from "../controllers/paymentController";
import { protect } from "../utils/protect";

router.put("/create-payment", protect, createPayment);
router.put("/create-payment-cash-payment", createPaymentCashPayment);
router.put("/cash-payment", createCashPayment);

export default router;
