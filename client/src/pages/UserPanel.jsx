import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const UserPanel = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products', { withCredentials: true });
        setProducts(response.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  // Add a product to the cart
  const addToCart = async (productId) => {
    try {
      await axios.post('/api/cart', { productId, quantity: 1 }, { withCredentials: true });
      alert('Product added to cart!');
    } catch (error) {
      setError(error.message || 'Failed to add product to cart');
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>You are a buyer.</p>

      {/* Display error message if there's an error */}
      {error && <div className="error">{error}</div>}

      <h2>All Products</h2>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>
              <button onClick={() => addToCart(product._id)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default UserPanel;