// client/src/pages/CartPage.jsx
 import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
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

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-page">
      <ToastContainer />
      <h1>Your Cart</h1>
      
      {cart ? (
        <>
          {cart.products.length > 0 ? (
            <>
              <div className="cart-items">
                {cart.products.map(item => (
                  <div key={item.product.id} className="cart-item">
                    <div className="product-info">
                      <h3>{item.product.name}</h3>
                      <p>${typeof item.product.price === 'number' ? item.product.price.toFixed(2) : '0.00'} each</p>
                    </div>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-subtotal">
                      ${(typeof item.product.price === 'number' ? item.product.price * item.quantity : 0).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <h2>Total: ${calculateTotal().toFixed(2)}</h2>
                <button className="checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            </>
          ) : (
            <p className="empty-cart">Your cart is empty</p>
          )}
        </>
      ) : (
        <p className="error-message">Failed to load cart</p>
      )}
    </div>
  );
};

export default CartPage;