import express from 'express';
import Order from '../models/Orderz.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    // Emit real-time update
    req.app.get('io').emit('order_created', order);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get orders for specific seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const orders = await Order.find({
      'products.sellerId': req.params.sellerId,
      createdAt: { 
        $gte: getDateRange(req.query.range || 'week') 
      }
    }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function getDateRange(range) {
  const now = new Date();
  switch(range) {
    case 'day': return new Date(now.setHours(0, 0, 0, 0));
    case 'month': return new Date(now.setMonth(now.getMonth() - 1));
    case 'year': return new Date(now.setFullYear(now.getFullYear() - 1));
    default: return new Date(now.setDate(now.getDate() - 7)); // week
  }
}

export default router;