import express from 'express';
import { startMonetbilPayment, checkMonetbilPayment, monetbilNotify } from '../controllers/paymentController';

const router = express.Router();

// Start a Monetbil payment for an order
router.post('/monetbil/start', startMonetbilPayment);

// Check Monetbil payment status for an order
router.get('/monetbil/check', checkMonetbilPayment);

// Notification webhook (Monetbil -> our server)
router.post('/monetbil/notify', monetbilNotify);

export default router;
