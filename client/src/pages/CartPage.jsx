import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart', { withCredentials: true });
      setCart(data);
    } catch (err) {
      toast.error('Failed to load cart');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setCart(prev => ({
        ...prev,
        products: prev.products.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      }));
      
      await axios.put(
        `/api/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
    } catch (err) {
      toast.error('Failed to update quantity');
      console.error('quantity update error:', err);
      fetchCart();
    }
  };

  const removeItem = async (productId) => {
    try {
      setCart(prev => ({
        ...prev,
        products: prev.products.filter(item => item.product.id !== productId)
      }));
      
      await axios.delete(`/api/cart/${productId}`, { withCredentials: true });
      toast.success('Product removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
      console.error('remove item error:', err);
      fetchCart();
    }
  };

  const calculateTotal = () => {
    if (!cart?.products) return 0;
    return cart.products.reduce((total, item) => {
      const price = typeof item.product.price === 'number' ? item.product.price : 0;
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading) return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{
          width: 50,
          height: 50,
          border: '5px solid #e2e8f0',
          borderTopColor: '#1a365d',
          borderRightColor: '#1a365d',
          borderRadius: '50%'
        }}
      />
      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading your cart...
      </motion.p>
    </motion.div>
  );

  return (
    <motion.div 
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer />
      
      {/* Animated background elements */}
      <motion.div 
        className="cart-background-circle top-left"
        animate={{
          x: [-20, 0, -20],
          y: [-10, 10, -10],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="cart-background-circle bottom-right"
        animate={{
          x: [0, 20, 0],
          y: [10, -10, 10],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.h1
        className="cart-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Your Shopping Cart
      </motion.h1>
      
      {cart ? (
        <>
          {cart.products.length > 0 ? (
            <>
              <motion.div 
                className="cart-items-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AnimatePresence>
                  {cart.products.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      className="cart-item glass-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.1 * index }
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      whileHover={{ 
                        y: -5,
                        boxShadow: '0 10px 25px rgba(26, 54, 93, 0.1)'
                      }}
                      layout
                    >
                      <div className="product-image">
                        <motion.img
                          src={item.product.image || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring' }}
                        />
                      </div>
                      <div className="product-info">
                        <h3>{item.product.name}</h3>
                        <p className="price">${typeof item.product.price === 'number' ? item.product.price.toFixed(2) : '0.00'} each</p>
                      </div>
                      <div className="quantity-controls">
                        <motion.button
                          className="quantity-btn dark-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        <span className="quantity">{item.quantity}</span>
                        <motion.button
                          className="quantity-btn dark-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                      <div className="item-subtotal">
                        ${(typeof item.product.price === 'number' ? item.product.price * item.quantity : 0).toFixed(2)}
                      </div>
                      <motion.button
                        className="remove-btn dark-btn"
                        onClick={() => removeItem(item.product.id)}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 5px 15px rgba(229, 62, 62, 0.3)'
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className="cart-summary glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                <motion.button
                  className="checkout-btn dark-btn"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 10px 20px rgba(26, 54, 93, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="empty-cart glass-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <motion.div 
                className="empty-icon"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                🛒
              </motion.div>
              <h2>Your Cart is Empty</h2>
              <p>Looks like you haven't added anything to your cart yet</p>
              <motion.button
                className="continue-shopping-btn dark-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div 
          className="error-message glass-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Failed to load cart. Please try again.
        </motion.div>
      )}
    </motion.div>
  );
};

export default CartPage;