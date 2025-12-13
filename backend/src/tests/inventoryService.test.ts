import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Sweet from '../models/Sweet';
import User from '../models/User';
import Purchase from '../models/Purchase';
import { purchaseSweet, restockSweet, getPurchaseHistory } from '../services/inventoryService';

let mongoServer: MongoMemoryServer;
let userId: string;
let adminId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const user = await User.create({
    email: 'user@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'user'
  });
  userId = user._id.toString();

  const admin = await User.create({
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin'
  });
  adminId = admin._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Sweet.deleteMany({});
  await Purchase.deleteMany({});
});

describe('Inventory Service - TDD', () => {
  describe('Purchase Sweet', () => {
    it('should successfully purchase sweet with available quantity', async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 50,
        quantity: 100
      });

      const result = await purchaseSweet(userId, sweet._id.toString(), 10);

      expect(result.purchase).toBeDefined();
      expect(result.purchase.quantity).toBe(10);
      expect(result.purchase.totalPrice).toBe(500);
      expect(result.sweet.quantity).toBe(90);
    });

    it('should decrease sweet quantity after purchase', async () => {
      const sweet = await Sweet.create({
        name: 'Rasgulla',
        category: 'Traditional',
        price: 40,
        quantity: 50
      });

      await purchaseSweet(userId, sweet._id.toString(), 5);

      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet?.quantity).toBe(45);
    });

    it('should create purchase record in database', async () => {
      const sweet = await Sweet.create({
        name: 'Jalebi',
        category: 'Traditional',
        price: 35,
        quantity: 80
      });

      await purchaseSweet(userId, sweet._id.toString(), 15);

      const purchases = await Purchase.find({ user: userId });
      expect(purchases).toHaveLength(1);
      expect(purchases[0].quantity).toBe(15);
    });

    it('should throw error when quantity is insufficient', async () => {
      const sweet = await Sweet.create({
        name: 'Barfi',
        category: 'Traditional',
        price: 60,
        quantity: 5
      });

      await expect(
        purchaseSweet(userId, sweet._id.toString(), 10)
      ).rejects.toThrow('Insufficient quantity available');
    });

    it('should throw error when sweet does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      await expect(
        purchaseSweet(userId, fakeId, 5)
      ).rejects.toThrow('Sweet not found');
    });

    it('should throw error when purchase quantity is zero or negative', async () => {
      const sweet = await Sweet.create({
        name: 'Ladoo',
        category: 'Traditional',
        price: 45,
        quantity: 100
      });

      await expect(
        purchaseSweet(userId, sweet._id.toString(), 0)
      ).rejects.toThrow('Quantity must be at least 1');

      await expect(
        purchaseSweet(userId, sweet._id.toString(), -5)
      ).rejects.toThrow('Quantity must be at least 1');
    });

    it('should calculate total price correctly', async () => {
      const sweet = await Sweet.create({
        name: 'Kaju Katli',
        category: 'Premium',
        price: 120,
        quantity: 50
      });

      const result = await purchaseSweet(userId, sweet._id.toString(), 7);

      expect(result.purchase.totalPrice).toBe(840);
    });

    it('should allow multiple purchases by same user', async () => {
      const sweet = await Sweet.create({
        name: 'Peda',
        category: 'Traditional',
        price: 30,
        quantity: 100
      });

      await purchaseSweet(userId, sweet._id.toString(), 10);
      await purchaseSweet(userId, sweet._id.toString(), 5);

      const purchases = await Purchase.find({ user: userId });
      expect(purchases).toHaveLength(2);

      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet?.quantity).toBe(85);
    });
  });

  describe('Restock Sweet', () => {
    it('should successfully restock sweet', async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 50,
        quantity: 10
      });

      const result = await restockSweet(sweet._id.toString(), 50);

      expect(result).toBeDefined();
      expect(result.quantity).toBe(60);
    });

    it('should increase sweet quantity after restock', async () => {
      const sweet = await Sweet.create({
        name: 'Rasgulla',
        category: 'Traditional',
        price: 40,
        quantity: 20
      });

      await restockSweet(sweet._id.toString(), 30);

      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet?.quantity).toBe(50);
    });

    it('should throw error when sweet does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      await expect(
        restockSweet(fakeId, 50)
      ).rejects.toThrow('Sweet not found');
    });

    it('should throw error when restock quantity is zero or negative', async () => {
      const sweet = await Sweet.create({
        name: 'Jalebi',
        category: 'Traditional',
        price: 35,
        quantity: 40
      });

      await expect(
        restockSweet(sweet._id.toString(), 0)
      ).rejects.toThrow('Restock quantity must be positive');

      await expect(
        restockSweet(sweet._id.toString(), -10)
      ).rejects.toThrow('Restock quantity must be positive');
    });

    it('should handle large restock quantities', async () => {
      const sweet = await Sweet.create({
        name: 'Barfi',
        category: 'Traditional',
        price: 60,
        quantity: 5
      });

      const result = await restockSweet(sweet._id.toString(), 500);

      expect(result.quantity).toBe(505);
    });
  });

  describe('Get Purchase History', () => {
    it('should return purchase history for a user', async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 50,
        quantity: 100
      });

      await purchaseSweet(userId, sweet._id.toString(), 10);
      await purchaseSweet(userId, sweet._id.toString(), 5);

      const history = await getPurchaseHistory(userId);

      expect(history).toHaveLength(2);
      expect(history[0].quantity).toBeDefined();
    });

    it('should return empty array when user has no purchases', async () => {
      const history = await getPurchaseHistory(userId);

      expect(history).toHaveLength(0);
    });

    it('should populate sweet details in purchase history', async () => {
      const sweet = await Sweet.create({
        name: 'Rasgulla',
        category: 'Traditional',
        price: 40,
        quantity: 50
      });

      await purchaseSweet(userId, sweet._id.toString(), 3);

      const history = await getPurchaseHistory(userId);

      expect(history[0].sweet).toBeDefined();
      expect((history[0].sweet as any).name).toBe('Rasgulla');
    });

    it('should return purchases sorted by date (newest first)', async () => {
      const sweet1 = await Sweet.create({
        name: 'Sweet 1',
        category: 'Traditional',
        price: 30,
        quantity: 100
      });

      const sweet2 = await Sweet.create({
        name: 'Sweet 2',
        category: 'Traditional',
        price: 40,
        quantity: 100
      });

      await purchaseSweet(userId, sweet1._id.toString(), 5);
      await new Promise(resolve => setTimeout(resolve, 100));
      await purchaseSweet(userId, sweet2._id.toString(), 3);

      const history = await getPurchaseHistory(userId);

      expect((history[0].sweet as any).name).toBe('Sweet 2');
      expect((history[1].sweet as any).name).toBe('Sweet 1');
    });
  });
});
