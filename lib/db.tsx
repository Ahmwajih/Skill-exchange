import mongoose from 'mongoose';
import User from '@/models/User'; // Ensure the User model is imported
import Skill from '@/models/Skill'; // Ensure the Skill model is imported

const db = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
    
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
 
export default db;
