// client/src/pages/SellerPanel.jsx 
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import SellerAnalytics from '../components/SellerAnalytics';
import 'react-toastify/dist/ReactToastify.css';

const SellerPanel = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products', { withCredentials: true });
        setProducts(data.filter(p => p.seller === user.id));
      } catch {
        toast.error('Failed to load products');
      }
    };
    fetchProducts();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/products', formData, { withCredentials: true });
      setProducts([...products, data]);
      setFormData({ name: '', price: '', description: '' });
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`, { withCredentials: true });
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="seller-panel">
      <ToastContainer />
      <h1>Your Products</h1>
      
      <div className="add-product-form">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="number"
            placeholder="Price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
          <textarea
            placeholder="Description"
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>

      <div className="product-list">
        <h2>Your Product List</h2>
        {products.length > 0 ? (
          <ul>
            {products.map(product => (
              <li key={product.id}>
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <p>{product.description}</p>
                <div className="product-actions">
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found. Add your first product!</p>
        )}
      </div>
    </div>
  );
};

export default SellerPanel;