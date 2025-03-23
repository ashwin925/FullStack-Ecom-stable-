import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SellerPanel = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [error, setError] = useState('');

  // Fetch seller's products
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/products', formData, { withCredentials: true });
      setProducts([...products, response.data]);
      setFormData({ name: '', price: '', description: '' });
    } catch (error) {
      setError(error.message || 'Failed to create product');
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`, { withCredentials: true });
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      setError(error.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>You are a seller.</p>

      <h2>Add a New Product</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      <h2>Your Products</h2>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SellerPanel;