import express from 'express'
const router = express();

import {
    createCheckout,
    retrieve
} from '../controllers/payMongo.js'

import {
    createMongopayPayment
} from '../controllers/mongopayController.js'

// PROTECT ROUTE

router.post('/create-checkout-session',createCheckout)
router.get('/retrieve-checkout',retrieve)

router.post('/create-paymongo',createMongopayPayment)


export default router