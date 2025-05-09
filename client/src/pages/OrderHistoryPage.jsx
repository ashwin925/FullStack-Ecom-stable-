// client/src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        setOrders(data);
      } catch (error) {
        console.error('Order history error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your order history...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="order-history"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToastContainer />
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="order-history-title"
      >
        Your Order History
      </motion.h1>
      
      {orders.length > 0 ? (
        <div className="orders-container">
          <AnimatePresence>
            {orders.map(order => (
              <motion.div 
                key={order.id}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
                layout
              >
                <div 
                  className="order-header"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="order-meta">
                    <span className="order-id">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="order-status">
                    <span className="status-badge">Completed</span>
                    <motion.div
                      animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                      className="expand-icon"
                    >
                      ▼
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="order-details"
                    >
                      <div className="order-products">
                        {order.products.map((product, index) => (
                          <div key={`${product.productId}-${index}`} className="product-item">
                            <div className="product-image">
                              <img 
                                src={product.image || '/placeholder-product.jpg'} 
                                alt={product.name}
                              />
                            </div>
                            <div className="product-info">
                              <h3>{product.name}</h3>
                              <p>${product.price.toFixed(2)} × {product.quantity}</p>
                            </div>
                            <div className="product-total">
                              ${(product.price * product.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-summary">
                        <div className="summary-row">
                          <span>Subtotal</span>
                          <span>${order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total</span>
                          <span>${order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          className="no-orders"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Your order history will appear here once you place an order</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shop-now-btn"
          >
            Shop Now
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderHistoryPage;