import express from 'express'
const router = express.Router();

import {
    createOrderCon,
    captureOrderCon
} from '../controllers/paypalController.js';


router.post('/orders',createOrderCon);
router.post('/orders/capture',captureOrderCon);




export default router