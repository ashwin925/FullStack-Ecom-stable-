import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Fetch the user's cart
  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart', {
        withCredentials: true,
        headers: {
          'User-ID': user.id,
        },
      });
      setCart(response.data);
    } catch (error) {
      setError(error.message || 'Failed to fetch cart');
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    if (!productId || isUpdating) return;
    
    setIsUpdating(true);
    try {
      await axios.delete(`/api/cart/${productId}`, { withCredentials: true });
      await fetchCart(); // Refresh cart data
    } catch (error) {
      setError(error.message || 'Failed to remove product from cart');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update the quantity of a product in the cart
  const updateQuantity = async (productId, newQuantity) => {
    if (!productId || isUpdating || newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await axios.put(
        `/api/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      await fetchCart(); // Refresh cart data
    } catch (error) {
      setError(error.message || 'Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce((total, item) => {
      const itemPrice = item.product?.price || 0;
      const itemQuantity = item.quantity || 0;
      return total + itemPrice * itemQuantity;
    }, 0);
  };

  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {error && <div className="error-message">{error}</div>}

      {cart ? (
        <>
          {cart.products.length > 0 ? (
            <ul className="cart-items">
              {cart.products.map((item) => (
                <li key={`${item.product._id}-${item.quantity}`} className="cart-item">
                  <div className="product-info">
                    <h3>{item.product.name}</h3>
                    <p>Price: ${item.product.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-controls">
                    <button
                      type="button"
                      className="quantity-btn"
                      disabled={isUpdating}
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="quantity-btn"
                      disabled={isUpdating || item.quantity <= 1}
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="remove-btn"
                      disabled={isUpdating}
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-cart">Your cart is empty.</p>
          )}

          <div className="cart-summary">
            <h2>Total: ${calculateTotal().toFixed(2)}</h2>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={!cart?.products?.length || isUpdating}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="loading">Loading cart...</p>
      )}
    </div>
  );
};

export default CartPage;