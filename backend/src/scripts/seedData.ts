import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sweet from '../models/Sweet';

dotenv.config();

const sampleSweets = [
  {
    name: 'Chocolate Truffle',
    category: 'Chocolate',
    price: 299,
    quantity: 25,
    description: 'Rich dark chocolate truffle with cocoa powder coating',
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400'
  },
  {
    name: 'Strawberry Gummy Bears',
    category: 'Gummy',
    price: 149,
    quantity: 50,
    description: 'Soft and chewy strawberry-flavored gummy bears',
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400'
  },
  {
    name: 'Vanilla Fudge',
    category: 'Fudge',
    price: 349,
    quantity: 15,
    description: 'Creamy vanilla fudge made with real vanilla beans',
    imageUrl: 'https://images.unsplash.com/photo-1568065850562-a0d9940bdcba?w=400'
  },
  {
    name: 'Lemon Drops',
    category: 'Hard Candy',
    price: 99,
    quantity: 100,
    description: 'Tangy lemon-flavored hard candies',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400'
  },
  {
    name: 'Mint Chocolate Chip',
    category: 'Chocolate',
    price: 249,
    quantity: 20,
    description: 'Refreshing mint chocolate with crunchy chips',
    imageUrl: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400'
  },
  {
    name: 'Caramel Toffee',
    category: 'Toffee',
    price: 299,
    quantity: 30,
    description: 'Buttery caramel toffee with a hint of sea salt',
    imageUrl: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=400'
  },
  {
    name: 'Rainbow Lollipops',
    category: 'Lollipop',
    price: 199,
    quantity: 40,
    description: 'Colorful swirl lollipops in assorted fruit flavors',
    imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400'
  },
  {
    name: 'Peanut Butter Cups',
    category: 'Chocolate',
    price: 399,
    quantity: 18,
    description: 'Smooth peanut butter wrapped in milk chocolate',
    imageUrl: 'https://images.unsplash.com/photo-1572899247272-5c86f9b2e4b6?w=400'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
    
    // Clear existing sweets
    await Sweet.deleteMany({});
    console.log('🗑️  Cleared existing sweets');
    
    // Insert sample sweets
    const result = await Sweet.insertMany(sampleSweets);
    console.log(`✅ Successfully seeded ${result.length} sweets:`);
    result.forEach((sweet, index) => {
      console.log(`   ${index + 1}. ${sweet.name} - ${sweet.category} - ₹${sweet.price}`);
    });
    
    console.log('\n🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
