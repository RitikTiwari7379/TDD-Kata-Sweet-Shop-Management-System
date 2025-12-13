import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Sweet from '../models/Sweet';

dotenv.config();

const migrate = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for migration');

    // Create indexes
    await User.createIndexes();
    await Sweet.createIndexes();

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();
