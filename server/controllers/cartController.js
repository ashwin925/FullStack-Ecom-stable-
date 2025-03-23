import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get the user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Add a product to the cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create a new cart if it doesn't exist
    cart = new Cart({
      user: req.user._id,
      products: [{ product: productId, quantity }],
    });
  } else {
    // Check if the product is already in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex >= 0) {
      // Update the quantity if the product is already in the cart
      cart.products[productIndex].quantity += quantity;
    } else {
      // Add the product to the cart
      cart.products.push({ product: productId, quantity });
    }
  }

  await cart.save();
  res.status(201).json(cart);
});

// @desc    Remove a product from the cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    // Remove the product from the cart
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.json({ message: 'Product removed from cart' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Update the quantity of a product in the cart
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === req.params.productId
    );

    if (productIndex >= 0) {
      // Update the quantity
      cart.products[productIndex].quantity = quantity;

      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Product not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});