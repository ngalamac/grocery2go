import express from 'express';
import { startMonetbilPayment, checkMonetbilPayment, monetbilNotify, cancelMonetbilPayment } from '../controllers/paymentController';

const router = express.Router();

// Start a Monetbil payment for an order
router.post('/monetbil/start', startMonetbilPayment);

// Check Monetbil payment status for an order
router.get('/monetbil/check', checkMonetbilPayment);

// Notification webhook (Monetbil -> our server)
router.post('/monetbil/notify', monetbilNotify);

// Cancel/reset a pending Monetbil payment for an order
router.post('/monetbil/cancel', cancelMonetbilPayment);

export default router;
