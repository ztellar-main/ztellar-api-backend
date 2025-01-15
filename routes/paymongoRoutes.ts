import express from 'express';
const router = express.Router();

import {
  createCheckout,
  retrieveCheckout,
  createCheckoutCashPayment,
  retrieveCheckoutCashPayment,
  paymentIntent,
  createPaymentMethod,
  attachPaymentIntent,
  retrievePaymentIntent,
  createPaymentMethodForEvent,
  attachPaymentIntentForEvent,
  retrievePaymentIntentForEvent,
  createPaymentIntentForEvent,
} from '../controllers/paymongoController';

import { protect } from '../utils/protect';

router.post('/create-checkout', protect, createCheckout);
router.post(
  '/create-checkout-cash-payment',
  protect,
  createCheckoutCashPayment
);
router.get('/retrieve-checkout', protect, retrieveCheckout);
router.get(
  '/retrieve-checkout-cash-payment',
  protect,
  retrieveCheckoutCashPayment
);
router.post('/create-payment-intent', protect, paymentIntent);
router.post('/create-payment-method', protect, createPaymentMethod);
router.post('/attach-payment-intent', protect, attachPaymentIntent);
router.put('/retrieve-payment-intent', protect, retrievePaymentIntent);

// event
router.post(
  '/create-payment-intent-for-event',
  protect,
  createPaymentIntentForEvent
);
router.post(
  '/create-payment-method-for-event',
  protect,
  createPaymentMethodForEvent
);
router.post(
  '/attach-payment-intent-for-event',
  protect,
  attachPaymentIntentForEvent
);
router.put(
  '/retrieve-payment-intent-for-event',
  protect,
  retrievePaymentIntentForEvent
);

export default router;
