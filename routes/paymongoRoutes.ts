import express from "express";
const router = express.Router();

import {
  createCheckout,
  retrieveCheckout,
  createCheckoutCashPayment,
  retrieveCheckoutCashPayment
} from "../controllers/paymongoController";

import { protect } from "../utils/protect";

router.post("/create-checkout", protect, createCheckout);
router.post("/create-checkout-cash-payment", protect, createCheckoutCashPayment);
router.get("/retrieve-checkout", protect, retrieveCheckout);
router.get("/retrieve-checkout-cash-payment", protect, retrieveCheckoutCashPayment);


export default router;
