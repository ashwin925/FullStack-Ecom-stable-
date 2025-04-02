// firebaseDB.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

// Collections
const usersCol = db.collection('users');
const productsCol = db.collection('products');
const cartsCol = db.collection('carts');
const ordersCol = db.collection('orders'); // Added orders collection

// Export FieldValue separately
export { db, usersCol, productsCol, cartsCol, ordersCol, FieldValue };