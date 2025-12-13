import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  createSweet,
  getAllSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  searchSweets
} from '../services/sweetService';

export const addSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, price, quantity, description, imageUrl } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      res.status(400).json({ message: 'Name, category, price, and quantity are required' });
      return;
    }

    const sweet = await createSweet({ name, category, price, quantity, description, imageUrl });
    res.status(201).json(sweet);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const getSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sweets = await getAllSweets();
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const sweet = await getSweetById(id);

    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    res.status(200).json(sweet);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const editSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const sweet = await updateSweet(id, updateData);

    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    res.status(200).json(sweet);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const removeSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const sweet = await deleteSweet(id);

    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    res.status(200).json({ message: 'Sweet deleted successfully', sweet });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const searchSweetsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const criteria: any = {};
    if (name) criteria.name = name as string;
    if (category) criteria.category = category as string;
    if (minPrice) criteria.minPrice = parseFloat(minPrice as string);
    if (maxPrice) criteria.maxPrice = parseFloat(maxPrice as string);

    const sweets = await searchSweets(criteria);
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
