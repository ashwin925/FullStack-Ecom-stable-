import asyncHandler from 'express-async-handler';
import { productsCol } from '../config/firebaseDB.js';

export const getProducts = asyncHandler(async (req, res) => {
  const snapshot = await productsCol.get();
  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  res.json(products);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description } = req.body;

  const product = {
    name,
    price: Number(price),
    description,
    seller: req.user.id,
    createdAt: new Date().toISOString()
  };

  const docRef = await productsCol.add(product);
  const productDoc = await docRef.get();
  
  res.status(201).json({
    id: docRef.id,
    ...productDoc.data()
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  const productRef = productsCol.doc(id);
  const productDoc = await productRef.get();

  if (!productDoc.exists) {
    res.status(404);
    throw new Error('Product not found');
  }

  await productRef.update({
    name: name || productDoc.data().name,
    price: price ? Number(price) : productDoc.data().price,
    description: description || productDoc.data().description
  });

  const updatedDoc = await productRef.get();
  res.json({
    id: updatedDoc.id,
    ...updatedDoc.data()
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productRef = productsCol.doc(id);
  const productDoc = await productRef.get();

  if (!productDoc.exists) {
    res.status(404);
    throw new Error('Product not found');
  }

  await productRef.delete();
  res.json({ message: 'Product removed' });
});