import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let dbConnected = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Continuing without database support.');
    dbConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    dbConnected = true;
    return true;
  } catch (error) {
    console.warn(`Database connection failed: ${error.message}`);
    console.warn('Continuing without database-backed features.');
    dbConnected = false;
    return false;
  }
};

export const isDbConnected = () => dbConnected;

export default connectDB;
