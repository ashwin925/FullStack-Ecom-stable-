// server/routes/cart.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity
} from '../controllers/cartController.js';

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

router.route('/:productId')
  .delete(protect, removeFromCart)
  .put(protect, updateCartItemQuantity);

export default router;