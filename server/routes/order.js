// routes/order.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { createOrder } from '../controllers/orderController.js';

const router = express.Router();
router.post('/', protect, createOrder);
export default router;