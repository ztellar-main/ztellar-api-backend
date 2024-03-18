import express from 'express'
const router = express.Router();

// CONTROLLERS
import {
    createFeedBack
} from '../controllers/feedbackController.js'

// DONE
router.put('/create-new-feedback',createFeedBack)

export default router