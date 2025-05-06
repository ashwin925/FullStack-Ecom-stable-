import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);