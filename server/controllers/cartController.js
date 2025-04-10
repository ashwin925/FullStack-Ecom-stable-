import asyncHandler from 'express-async-handler';
import { cartsCol, productsCol, FieldValue } from '../config/firebaseDB.js';
import { sendEmail } from '../config/email.js';


export const getCart = asyncHandler(async (req, res) => {
  try {
    const snapshot = await cartsCol.where('userId', '==', req.user.id).limit(1).get();
    
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
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Error loading cart' });
  }
});

export const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Verify product exists
    const productDoc = await productsCol.doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = productDoc.data();

    // Find or create cart
    const cartSnapshot = await cartsCol.where('userId', '==', req.user.id).limit(1).get();
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
      const cartData = cartSnapshot.docs[0].data();
      
      // Check if product exists in cart
      const existingIndex = cartData.products.findIndex(p => p.productId === productId);
      
      if (existingIndex >= 0) {
        // Update quantity
        const updatedProducts = [...cartData.products];
        updatedProducts[existingIndex].quantity += quantity;
        
        await cartRef.update({
          products: updatedProducts,
          updatedAt: FieldValue.serverTimestamp()
        });
      } else {
        // Add new product
        await cartRef.update({
          products: FieldValue.arrayUnion({ productId, quantity }),
          updatedAt: FieldValue.serverTimestamp()
        });
      }
    }

    if (req.user.email) {
      sendEmail(
        req.user.email,
        '🛒 Item Added to Cart',
        `Hello ${req.user.name},\n\n"${product.name}" was added to your cart.\n\nView your cart: ${process.env.FRONTEND_URL}/cart`
      ).catch(err => console.error('Email failed (non-critical):', err));
    }

    // Return success response without full cart data
    res.status(200).json({ 
      success: true,
      productName: productDoc.data().name,
      message: 'Product added to cart'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
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