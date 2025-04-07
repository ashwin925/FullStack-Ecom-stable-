// routes/order.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { createOrder, getOrders } from '../controllers/orderController.js';

const router = express.Router();
router.post('/', protect, createOrder);
router.get('/', protect, getOrders); 
export default router;