import express from 'express'
const router = express.Router();

import {
    paymentSave
} from '../controllers/paymentController.js'


// DONE
router.post('/create-payment',paymentSave)

export default router