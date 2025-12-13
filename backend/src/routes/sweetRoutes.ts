import express from 'express';
import {
  addSweet,
  getSweets,
  getSweet,
  editSweet,
  removeSweet,
  searchSweetsHandler
} from '../controllers/sweetController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes (require authentication)
router.get('/', authenticate, getSweets);
router.get('/search', authenticate, searchSweetsHandler);
router.get('/:id', authenticate, getSweet);

// Admin only routes
router.post('/', authenticate, authorizeAdmin, addSweet);
router.put('/:id', authenticate, authorizeAdmin, editSweet);
router.delete('/:id', authenticate, authorizeAdmin, removeSweet);

export default router;
