import express from 'express';
import {
  validateCoupon,
  applyCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/validate/:code', validateCoupon);
router.post('/apply', applyCoupon);
router.get('/', authenticate, requireAdmin, getAllCoupons);
router.post('/', authenticate, requireAdmin, createCoupon);
router.put('/:id', authenticate, requireAdmin, updateCoupon);
router.delete('/:id', authenticate, requireAdmin, deleteCoupon);

export default router;
