import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'ecom', // Explicitly specify the database name
    });
    console.log('MongoDB connected to database:', conn.connection.db.databaseName);
    console.log('Collections:', await conn.connection.db.listCollections().toArray());
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;