import express from 'express'
const router = express.Router();

import {
    CheckIfUserExistUsingEmail,
    checkProductIfexist
} from '../controllers/agentController.js'

import { protect } from '../middleware/authMiddleware.js';

router.post('/check-email-if-exist',protect,CheckIfUserExistUsingEmail)
router.post('/validate-receipt-description',protect,checkProductIfexist)

export default router