import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantBySlug,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/restaurantController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/slug/:slug', getRestaurantBySlug);
router.get('/:id', getRestaurantById);

router.post('/', authenticate, requireAdmin, createRestaurant);
router.put('/:id', authenticate, requireAdmin, updateRestaurant);
router.delete('/:id', authenticate, requireAdmin, deleteRestaurant);

router.post('/:id/menu', authenticate, requireAdmin, addMenuItem);
router.put('/:id/menu/:itemId', authenticate, requireAdmin, updateMenuItem);
router.delete('/:id/menu/:itemId', authenticate, requireAdmin, deleteMenuItem);

export default router;
