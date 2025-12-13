import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../models/User';
import { register, login, generateToken } from '../services/authService';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Service - TDD', () => {
  describe('User Registration', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const result = await register(userData);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.user.role).toBe('user');
      expect(result.token).toBeDefined();
      expect((result.user as any).password).toBeUndefined();
    });

    it('should hash the password before saving', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      await register(userData);
      const user = await User.findOne({ email: userData.email });

      expect(user?.password).not.toBe(userData.password);
      expect(user?.password).toBeDefined();
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      await register(userData);

      await expect(register(userData)).rejects.toThrow('Email already registered');
    });

    it('should throw error if email is invalid', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      };

      await expect(register(userData)).rejects.toThrow();
    });

    it('should throw error if password is too short', async () => {
      const userData = {
        email: 'test@example.com',
        password: '12345',
        name: 'Test User'
      };

      await expect(register(userData)).rejects.toThrow();
    });

    it('should throw error if required fields are missing', async () => {
      const userData = {
        email: 'test@example.com',
        password: '',
        name: ''
      };

      await expect(register(userData)).rejects.toThrow();
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      await register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    });

    it('should login user with correct credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await login(credentials);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(credentials.email);
      expect(result.token).toBeDefined();
      expect((result.user as any).password).toBeUndefined();
    });

    it('should throw error with incorrect password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      await expect(login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error with non-existent email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      await expect(login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error with empty credentials', async () => {
      const credentials = {
        email: '',
        password: ''
      };

      await expect(login(credentials)).rejects.toThrow();
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate a valid JWT token', () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should create token that can be verified', () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const token = generateToken(userId);
      const jwt = require('jsonwebtoken');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      expect(decoded.userId).toBe(userId);
    });
  });
});
