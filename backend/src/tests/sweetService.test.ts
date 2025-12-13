import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Sweet from '../models/Sweet';
import User from '../models/User';
import {
  createSweet,
  getAllSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  searchSweets
} from '../services/sweetService';

let mongoServer: MongoMemoryServer;
let adminUserId: string;
let userUserId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const adminUser = await User.create({
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin'
  });
  adminUserId = adminUser._id.toString();

  const regularUser = await User.create({
    email: 'user@example.com',
    password: 'password123',
    name: 'Regular User',
    role: 'user'
  });
  userUserId = regularUser._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Sweet.deleteMany({});
});

describe('Sweet Service - TDD', () => {
  describe('Create Sweet', () => {
    it('should create a new sweet with valid data', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 50,
        quantity: 100,
        description: 'Sweet syrupy balls'
      };

      const sweet = await createSweet(sweetData);

      expect(sweet).toBeDefined();
      expect(sweet.name).toBe(sweetData.name);
      expect(sweet.category).toBe(sweetData.category);
      expect(sweet.price).toBe(sweetData.price);
      expect(sweet.quantity).toBe(sweetData.quantity);
      expect(sweet._id).toBeDefined();
    });

    it('should create sweet with minimum required fields', async () => {
      const sweetData = {
        name: 'Rasgulla',
        category: 'Traditional',
        price: 40,
        quantity: 50
      };

      const sweet = await createSweet(sweetData);

      expect(sweet).toBeDefined();
      expect(sweet.name).toBe(sweetData.name);
    });

    it('should throw error if name is missing', async () => {
      const sweetData = {
        name: '',
        category: 'Traditional',
        price: 50,
        quantity: 100
      };

      await expect(createSweet(sweetData)).rejects.toThrow();
    });

    it('should throw error if price is negative', async () => {
      const sweetData = {
        name: 'Jalebi',
        category: 'Traditional',
        price: -10,
        quantity: 100
      };

      await expect(createSweet(sweetData)).rejects.toThrow();
    });

    it('should throw error if quantity is negative', async () => {
      const sweetData = {
        name: 'Barfi',
        category: 'Traditional',
        price: 60,
        quantity: -5
      };

      await expect(createSweet(sweetData)).rejects.toThrow();
    });

    it('should throw error if sweet name already exists', async () => {
      const sweetData = {
        name: 'Ladoo',
        category: 'Traditional',
        price: 45,
        quantity: 80
      };

      await createSweet(sweetData);
      await expect(createSweet(sweetData)).rejects.toThrow();
    });
  });

  describe('Get All Sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Gulab Jamun', category: 'Traditional', price: 50, quantity: 100 },
        { name: 'Rasgulla', category: 'Traditional', price: 40, quantity: 50 },
        { name: 'Chocolate Barfi', category: 'Fusion', price: 80, quantity: 30 }
      ]);
    });

    it('should return all sweets', async () => {
      const sweets = await getAllSweets();

      expect(sweets).toHaveLength(3);
      expect(sweets[0].name).toBeDefined();
    });

    it('should return empty array when no sweets exist', async () => {
      await Sweet.deleteMany({});
      const sweets = await getAllSweets();

      expect(sweets).toHaveLength(0);
    });
  });

  describe('Get Sweet By ID', () => {
    it('should return sweet by valid ID', async () => {
      const created = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 50,
        quantity: 100
      });

      const sweet = await getSweetById(created._id.toString());

      expect(sweet).toBeDefined();
      expect(sweet?.name).toBe('Gulab Jamun');
    });

    it('should return null for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const sweet = await getSweetById(fakeId);

      expect(sweet).toBeNull();
    });

    it('should throw error for invalid ID format', async () => {
      await expect(getSweetById('invalid-id')).rejects.toThrow();
    });
  });

  describe('Update Sweet', () => {
    it('should update sweet with valid data', async () => {
      const created = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 50,
        quantity: 100
      });

      const updateData = {
        price: 55,
        quantity: 120
      };

      const updated = await updateSweet(created._id.toString(), updateData);

      expect(updated).toBeDefined();
      expect(updated?.price).toBe(55);
      expect(updated?.quantity).toBe(120);
      expect(updated?.name).toBe('Gulab Jamun');
    });

    it('should update only specified fields', async () => {
      const created = await Sweet.create({
        name: 'Rasgulla',
        category: 'Traditional',
        price: 40,
        quantity: 50
      });

      const updated = await updateSweet(created._id.toString(), { price: 45 });

      expect(updated?.price).toBe(45);
      expect(updated?.quantity).toBe(50);
    });

    it('should return null for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const updated = await updateSweet(fakeId, { price: 100 });

      expect(updated).toBeNull();
    });

    it('should throw error when updating with negative price', async () => {
      const created = await Sweet.create({
        name: 'Jalebi',
        category: 'Traditional',
        price: 35,
        quantity: 60
      });

      await expect(
        updateSweet(created._id.toString(), { price: -10 })
      ).rejects.toThrow();
    });
  });

  describe('Delete Sweet', () => {
    it('should delete sweet by ID', async () => {
      const created = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Traditional',
        price: 50,
        quantity: 100
      });

      const deleted = await deleteSweet(created._id.toString());

      expect(deleted).toBeDefined();
      expect(deleted?.name).toBe('Gulab Jamun');

      const found = await Sweet.findById(created._id);
      expect(found).toBeNull();
    });

    it('should return null when deleting non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const deleted = await deleteSweet(fakeId);

      expect(deleted).toBeNull();
    });
  });

  describe('Search Sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Gulab Jamun', category: 'Traditional', price: 50, quantity: 100 },
        { name: 'Chocolate Barfi', category: 'Fusion', price: 80, quantity: 30 },
        { name: 'Rasgulla', category: 'Traditional', price: 40, quantity: 50 },
        { name: 'Kaju Katli', category: 'Premium', price: 120, quantity: 20 }
      ]);
    });

    it('should search sweets by name', async () => {
      const results = await searchSweets({ name: 'Gulab' });

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Gulab');
    });

    it('should search sweets by category', async () => {
      const results = await searchSweets({ category: 'Traditional' });

      expect(results.length).toBe(2);
    });

    it('should search sweets by price range', async () => {
      const results = await searchSweets({ minPrice: 40, maxPrice: 80 });

      expect(results.length).toBeGreaterThanOrEqual(3);
      results.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(40);
        expect(sweet.price).toBeLessThanOrEqual(80);
      });
    });

    it('should search with multiple criteria', async () => {
      const results = await searchSweets({
        category: 'Traditional',
        maxPrice: 50
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(sweet => {
        expect(sweet.category).toBe('Traditional');
        expect(sweet.price).toBeLessThanOrEqual(50);
      });
    });

    it('should return all sweets when no search criteria provided', async () => {
      const results = await searchSweets({});

      expect(results.length).toBe(4);
    });

    it('should return empty array when no matches found', async () => {
      const results = await searchSweets({ name: 'NonExistent' });

      expect(results).toHaveLength(0);
    });
  });
});
