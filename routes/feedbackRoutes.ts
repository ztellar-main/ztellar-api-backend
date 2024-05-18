import express from "express";
const router = express.Router();

import { createEventFeedback } from "../controllers/FeedbackController";

import { protect } from "../utils/protect";

router.post("/create-event-feedback", protect, createEventFeedback);

export default router;
