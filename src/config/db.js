import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.log('Error connecting to MOngoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
