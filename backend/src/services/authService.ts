import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'admin';
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export const generateToken = (userId: string): string => {
  const secret: string = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn: string = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const { email, password, name, role } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    name,
    role: role || 'user'
  });

  // Generate token
  const token = generateToken(user._id.toString());

  // Return user without password
  return {
    user: {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user._id.toString());

  // Return user without password
  return {
    user: {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};
