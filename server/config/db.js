import mongoose from 'mongoose';
import { config } from './env.js';

mongoose.set('strictQuery', true);

const connectDB = async () => {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(config.mongoUri, {
    autoIndex: true,
  });

  console.log('MongoDB connected');

  
};

export default connectDB;
