import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { purchaseSweet, restockSweet, getPurchaseHistory } from '../services/inventoryService';

export const purchaseSweetHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: 'Valid quantity is required' });
      return;
    }

    const result = await purchaseSweet(userId.toString(), id, quantity);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Sweet not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error.message === 'Insufficient quantity available') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const restockSweetHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: 'Valid restock quantity is required' });
      return;
    }

    const sweet = await restockSweet(id, quantity);
    res.status(200).json(sweet);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Sweet not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const getUserPurchases = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const purchases = await getPurchaseHistory(userId.toString());
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
