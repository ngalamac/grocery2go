import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder
} from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', createOrder);
router.get('/track', trackOrder);
router.get('/user', authenticate, getUserOrders);
router.get('/:id', getOrderById);
router.get('/', authenticate, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
