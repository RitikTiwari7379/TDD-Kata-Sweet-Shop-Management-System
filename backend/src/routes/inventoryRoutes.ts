import express from 'express';
import {
  purchaseSweetHandler,
  restockSweetHandler,
  getUserPurchases
} from '../controllers/inventoryController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// User routes
router.post('/:id/purchase', authenticate, purchaseSweetHandler);
router.get('/purchases', authenticate, getUserPurchases);

// Admin only routes
router.post('/:id/restock', authenticate, authorizeAdmin, restockSweetHandler);

export default router;
