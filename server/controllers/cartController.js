import asyncHandler from 'express-async-handler';
import { cartsCol, productsCol, FieldValue } from '../config/firebaseDB.js';

export const getCart = asyncHandler(async (req, res) => {
  const snapshot = await cartsCol.where('userId', '==', req.user.id).get();
  
  if (snapshot.empty) {
    return res.json({
      userId: req.user.id,
      products: [],
      total: 0
    });
  }

  const cartDoc = snapshot.docs[0];
  const cartData = cartDoc.data();

  // Populate product details
  const productsWithDetails = await Promise.all(
    cartData.products.map(async item => {
      const productDoc = await productsCol.doc(item.productId).get();
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: productDoc.id,
          ...productDoc.data()
        }
      };
    })
  );

  // Calculate total
  const total = productsWithDetails.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  res.json({
    id: cartDoc.id,
    userId: cartData.userId,
    products: productsWithDetails,
    total
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Verify product exists
  const productRef = productsCol.doc(productId);
  const productDoc = await productRef.get();
  
  if (!productDoc.exists) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find or create cart
  const cartSnapshot = await cartsCol.where('userId', '==', req.user.id).get();
  let cartRef, cartId;

  if (cartSnapshot.empty) {
    const newCartRef = await cartsCol.add({
      userId: req.user.id,
      products: [{ productId, quantity }],
      updatedAt: FieldValue.serverTimestamp()
    });
    cartRef = newCartRef;
    cartId = newCartRef.id;
  } else {
    cartId = cartSnapshot.docs[0].id;
    cartRef = cartsCol.doc(cartId);
    
    // Check if product already in cart
    const cartData = cartSnapshot.docs[0].data();
    const existingProductIndex = cartData.products.findIndex(
      p => p.productId === productId
    );

    if (existingProductIndex >= 0) {
      // Update quantity using array transform
      const updatedProducts = [...cartData.products];
      updatedProducts[existingProductIndex].quantity += quantity;
      
      await cartRef.update({
        products: updatedProducts,
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
      // Add new product using FieldValue
      await cartRef.update({
        products: FieldValue.arrayUnion({ productId, quantity }),
        updatedAt: FieldValue.serverTimestamp()
      });
    }
  }

  // Return updated cart
  const updatedCartDoc = await cartRef.get();
  const cartData = updatedCartDoc.data();

  res.status(201).json({
    id: cartId,
    ...cartData
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cartSnapshot = await cartsCol.where('userId', '==', req.user.id).get();
  if (cartSnapshot.empty) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const cartRef = cartsCol.doc(cartSnapshot.docs[0].id);
  const cartData = cartSnapshot.docs[0].data();

  // Filter out the product
  const updatedProducts = cartData.products.filter(
    item => item.productId !== productId
  );

  await cartRef.update({
    products: updatedProducts,
    updatedAt: FieldValue.serverTimestamp()
  });

  res.json({ message: 'Product removed from cart' });
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const cartSnapshot = await cartsCol.where('userId', '==', req.user.id).get();
  if (cartSnapshot.empty) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const cartRef = cartsCol.doc(cartSnapshot.docs[0].id);
  const cartData = cartSnapshot.docs[0].data();

  // Update product quantity
  const updatedProducts = cartData.products.map(item => {
    if (item.productId === productId) {
      return { ...item, quantity: Number(quantity) };
    }
    return item;
  });

  await cartRef.update({
    products: updatedProducts,
    updatedAt: FieldValue.serverTimestamp()
  });

  res.json({ message: 'Cart updated' });
});