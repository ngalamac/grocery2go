import express from 'express';
import {
  createReview,
  getProductReviews,
  getAllReviews,
  approveReview,
  deleteReview
} from '../controllers/reviewController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/', authenticate, requireAdmin, getAllReviews);
router.patch('/:id/approve', authenticate, requireAdmin, approveReview);
router.delete('/:id', authenticate, requireAdmin, deleteReview);

export default router;
