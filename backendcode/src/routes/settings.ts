import express from 'express';
import { getFees, updateFees } from '../controllers/settingsController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/fees', getFees);
router.put('/fees', authenticate, requireAdmin, updateFees);

export default router;
