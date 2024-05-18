import express from "express";
const router = express.Router();

import {
  createCheckout,
  retrieveCheckout,
} from "../controllers/paymongoController";

import { protect } from "../utils/protect";

router.post("/create-checkout", protect, createCheckout);
router.get("/retrieve-checkout", protect, retrieveCheckout);

export default router;
