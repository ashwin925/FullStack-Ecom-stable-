import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import errorHandler from './middleware/error.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000', // React default port
  'http://localhost:5173', // Vite default port
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS for preflight
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));