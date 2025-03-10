import express from 'express';
import { 
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, seller } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, seller, createProduct);

router.route('/:id')
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);

export default router;