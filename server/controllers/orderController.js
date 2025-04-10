import asyncHandler from 'express-async-handler';
import { ordersCol, productsCol, FieldValue } from '../config/firebaseDB.js';
import { sendEmail } from '../config/email.js';


export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Verify product exists
    const productDoc = await productsCol.doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = productDoc.data();

    // Create order (no additional auth checks)
    const orderRef = await ordersCol.add({
      userId: req.user.id,
      products: [{
        productId,
        name: product.name,
        price: product.price,
        quantity: 1
      }],
      status: 'completed',
      createdAt: FieldValue.serverTimestamp()
    });

    if (req.user.email) {
      sendEmail(
        req.user.email,
        '🎉 Order Confirmed',
        `Hello ${req.user.name},\n\nYour order for "${product.name}" ($${product.price}) was successful!\nOrder ID: ${orderRef.id.slice(0, 8)}`
      ).catch(err => console.error('Email failed (non-critical):', err));
    }

    res.status(201).json({ 
      success: true,
      orderId: orderRef.id 
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Order failed' });
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  try {
    const snapshot = await ordersCol
      .where('userId', '==', req.user.id)
      .orderBy('createdAt', 'desc')
      .get();
      
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString()
      };
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});