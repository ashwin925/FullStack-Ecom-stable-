// controllers/orderController.js
import asyncHandler from 'express-async-handler';
import { ordersCol, productsCol, FieldValue } from '../config/firebaseDB.js';

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Verify product exists
    const productDoc = await productsCol.doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create new order (single product)
    const newOrderRef = await ordersCol.add({
      userId: req.user.id,
      products: [{ productId, quantity: 1 }],
      status: 'pending',
      createdAt: FieldValue.serverTimestamp()
    });

    res.status(201).json({
      id: newOrderRef.id,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});