import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import errorHandler from './middleware/error.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  const app = express();

  // Configure session middleware
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
      }),
      cookie: {
        httpOnly: true,
        secure: false, // Change to true in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

  // CORS Configuration
  const allowedOrigins = ['http://localhost:5173']; // Add your frontend URL
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Allow credentials
    })
  );

  // Middleware
  app.use(express.json());
  app.use(cookieParser());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);

  // Error Handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}); 