import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { getSummary, getTopProducts } from '../controllers/reportController';

const router = express.Router();

router.get('/summary', authenticate, requireAdmin, getSummary);
router.get('/top-products', authenticate, requireAdmin, getTopProducts);

export default router;
