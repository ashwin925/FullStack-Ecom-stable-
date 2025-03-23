import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItemQuantity, // Add this line
} from '../controllers/cartController.js';

const router = express.Router();

router.route('/')
  .get(protect, getCart) // Get the user's cart
  .post(protect, addToCart); // Add a product to the cart

router.route('/:productId')
  .delete(protect, removeFromCart) // Remove a product from the cart
  .put(protect, updateCartItemQuantity); // Update the quantity of a product in the cart

export default router;