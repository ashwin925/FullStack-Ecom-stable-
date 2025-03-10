import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Add other product controller functions as needed
// (createProduct, updateProduct, deleteProduct etc)