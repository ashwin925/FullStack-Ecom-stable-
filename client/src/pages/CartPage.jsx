import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch the user's cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/cart', {
          withCredentials: true,
          headers: {
            'User-ID': user.id, // Pass the user ID if required
          },
        });
        setCart(response.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch cart');
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user]);

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    if (!productId) {
      setError('Product ID is missing');
      return;
    }

    try {
      await axios.delete(`/api/cart/${productId}`, { withCredentials: true });
      setCart((prevCart) => ({
        ...prevCart,
        products: prevCart.products.filter((item) => item.product._id !== productId),
      }));
    } catch (error) {
      setError(error.message || 'Failed to remove product from cart');
    }
  };

  // Update the quantity of a product in the cart
  const updateQuantity = async (productId, newQuantity) => {
    if (!productId) {
      setError('Product ID is missing');
      return;
    }
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(
        `/api/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      setCart(response.data);
    } catch (error) {
      setError(error.message || 'Failed to update quantity');
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
    <div>
      <h1>Your Cart</h1>
      {error && <div className="error">{error}</div>}

      {cart ? (
        <>
          {cart.products.length > 0 ? (
            <ul>
              {cart.products.map((item) => (
                item.product._id && ( // Ensure product._id exists
                  <li key={item.product._id}>
                    <h3>{item.product.name}</h3>
                    <p>Price: ${item.product.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                      +
                    </button>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                      -
                    </button>
                    <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
                  </li>
                )
              ))}
            </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}

          <h2>Total: ${calculateTotal()}</h2>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </>
      ) : (
        <p>Loading cart...</p>
      )}
    </div>
  );
};

export default CartPage;