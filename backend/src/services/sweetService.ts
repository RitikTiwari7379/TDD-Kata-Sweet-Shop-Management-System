import Sweet, { ISweet } from '../models/Sweet';
import mongoose from 'mongoose';

interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

interface UpdateSweetData {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
  imageUrl?: string;
}

interface SearchCriteria {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const createSweet = async (data: CreateSweetData): Promise<ISweet> => {
  try {
    const sweet = await Sweet.create(data);
    return sweet;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create sweet');
  }
};

export const getAllSweets = async (): Promise<ISweet[]> => {
  return await Sweet.find().sort({ createdAt: -1 });
};

export const getSweetById = async (id: string): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid sweet ID');
  }
  return await Sweet.findById(id);
};

export const updateSweet = async (
  id: string,
  data: UpdateSweetData
): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid sweet ID');
  }

  const sweet = await Sweet.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  return sweet;
};

export const deleteSweet = async (id: string): Promise<ISweet | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid sweet ID');
  }
  return await Sweet.findByIdAndDelete(id);
};

export const searchSweets = async (criteria: SearchCriteria): Promise<ISweet[]> => {
  const query: any = {};

  if (criteria.name) {
    query.name = { $regex: criteria.name, $options: 'i' };
  }

  if (criteria.category) {
    query.category = { $regex: criteria.category, $options: 'i' };
  }

  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    query.price = {};
    if (criteria.minPrice !== undefined) {
      query.price.$gte = criteria.minPrice;
    }
    if (criteria.maxPrice !== undefined) {
      query.price.$lte = criteria.maxPrice;
    }
  }

  return await Sweet.find(query).sort({ createdAt: -1 });
};
