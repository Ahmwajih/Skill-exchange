import { connect } from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }
    await connect(process.env.MONGODB_URL);
    console.log('Connected to DB successfully');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Database connection error:', err.message);
    } else {
      console.error('Unexpected error:', err);
    }
  }
};

export default connectDB;