import mongoose from 'mongoose';
import Sweet, { ISweet } from '../models/Sweet';
import Purchase, { IPurchase } from '../models/Purchase';

export const purchaseSweet = async (
  userId: string,
  sweetId: string,
  quantity: number
): Promise<{ purchase: IPurchase; sweet: ISweet }> => {
  if (quantity <= 0) {
    throw new Error('Quantity must be at least 1');
  }

  if (!mongoose.Types.ObjectId.isValid(sweetId)) {
    throw new Error('Invalid sweet ID');
  }

  const sweet = await Sweet.findById(sweetId);

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  if (sweet.quantity < quantity) {
    throw new Error('Insufficient quantity available');
  }

  // Calculate total price
  const totalPrice = sweet.price * quantity;

  // Create purchase record
  const purchase = await Purchase.create({
    user: userId,
    sweet: sweetId,
    quantity,
    totalPrice
  });

  // Update sweet quantity
  sweet.quantity -= quantity;
  await sweet.save();

  return { purchase, sweet };
};

export const restockSweet = async (
  sweetId: string,
  quantity: number
): Promise<ISweet> => {
  if (quantity <= 0) {
    throw new Error('Restock quantity must be positive');
  }

  if (!mongoose.Types.ObjectId.isValid(sweetId)) {
    throw new Error('Invalid sweet ID');
  }

  const sweet = await Sweet.findById(sweetId);

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  sweet.quantity += quantity;
  await sweet.save();

  return sweet;
};

export const getPurchaseHistory = async (userId: string): Promise<IPurchase[]> => {
  return await Purchase.find({ user: userId })
    .populate('sweet')
    .sort({ purchaseDate: -1 });
};
