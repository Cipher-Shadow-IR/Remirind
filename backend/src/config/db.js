const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  console.log('Connecting to MongoDB...');
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of hanging indefinitely
  });
  console.log(`MongoDB connected successfully: ${conn.connection.host}`);
};

module.exports = connectDB;

