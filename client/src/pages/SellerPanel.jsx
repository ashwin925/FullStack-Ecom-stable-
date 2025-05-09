// client/src/pages/SellerPanel.jsx (Updated with analytics integration)
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import SellerAnalytics from '../components/SellerAnalytics';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import './SellerPanel.css';

const SellerPanel = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

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
    <motion.div 
      className="seller-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToastContainer />
      <h1>Seller Dashboard</h1>
      
      <div className="seller-tabs">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          My Products
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Sales Analytics
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          <motion.div 
            className="add-product-form"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Product Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Adding...
                  </>
                ) : 'Add Product'}
              </button>
            </form>
          </motion.div>

          <div className="product-list">
            <h2>Your Product List</h2>
            {products.length > 0 ? (
              <div className="product-grid">
                {products.map(product => (
                  <motion.div 
                    key={product.id}
                    className="product-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3>{product.name}</h3>
                    <p className="price">${product.price.toFixed(2)}</p>
                    <p className="description">{product.description}</p>
                    <div className="product-actions">
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No products found. Add your first product!</p>
              </motion.div>
            )}
          </div>
        </>
      ) : (
        <SellerAnalytics />
      )}
    </motion.div>
  );
};

export default SellerPanel;