import express from 'express';
import { getProducts } from '../controllers/productController.js';
import { protect, seller } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);

export default router;