// client/src/pages/UserPanel.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import ProductFilters from './ProductFilters';
import Rating from '../components/Rating';
import './UserPanel.css';

const UserPanel = () => {
  const { user, updateLocalProfile } = useAuth();
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || 'prefer-not-to-say'
  });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchParams.get('search') || '',
          minPrice: searchParams.get('minPrice') || '',
          maxPrice: searchParams.get('maxPrice') || '',
          category: searchParams.get('category') || ''
        };
    
        setSearchQuery(params.search);
        
        const cleanParams = {};
        for (const [paramKey, paramValue] of Object.entries(params)) {
          if (paramValue !== '') {
            cleanParams[paramKey] = paramValue;
          }
        }
    
        const { data } = await axios.get('/api/products', { params: cleanParams });
        setProducts(data);
      } catch (err) {
        toast.error('Failed to load products');
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || 'prefer-not-to-say'
      });
    }
  }, [user]);

  const addToCart = async (productId) => {
    try {
      await axios.post('/api/cart', { productId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateLocalProfile(profileData);
    setEditMode(false);
    toast.success('Profile updated!');
  };

  const clearFilters = () => {
    window.location.search = '';
  };

  const handleOrderNow = async (productId) => {
    try {
      const { data } = await axios.post('/api/orders', { productId });
      toast.success(`Order #${data.orderId.slice(0, 6)} placed!`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <motion.div 
      className="user-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToastContainer />
      <motion.h1
        style={{ marginTop: '20px' }}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="panel-title"
      >
        Welcome, {user?.name}!
      </motion.h1>

      <div className="panel-content">
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="section-header">
            <h2>Your Profile</h2>
            {!editMode && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(true)}
                className="edit-btn"
              >
                Edit Profile
              </motion.button>
            )}
          </div>

          {editMode ? (
            <motion.form 
              onSubmit={handleProfileSubmit}
              className="profile-edit-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
              
              <div className="form-group">
                <label>Birthday</label>
                <input
                  type="date"
                  name="dob"
                  value={profileData.dob}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              
              <div className="form-actions">
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="save-btn"
                >
                  Save Changes
                </motion.button>
                <motion.button 
                  type="button" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditMode(false)}
                  className="cancel-btn"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              className="profile-display"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="profile-info">
                <div className="profile-image">
                  <img 
                    src={user?.profilePictureUrl || '/default-profile.png'} 
                    alt="Profile" 
                  />
                </div>
                <div className="profile-details">
                  <h3>{user?.name}</h3>
                  <p><span>Email:</span> {user?.email}</p>
                  {user?.phone && <p><span>Phone:</span> {user.phone}</p>}
                  {user?.dob && <p><span>Birthday:</span> {new Date(user.dob).toLocaleDateString()}</p>}
                  <p><span>Gender:</span> {user?.gender || 'Not specified'}</p>
                  <p><span>Account Type:</span> {user?.role}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className="products-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <h2>Available Products</h2>
            <ProductFilters />
          </div>

          {loading ? (
            <div className="loading-products">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              <AnimatePresence>
                {products.map(product => (
                  <motion.div
                    key={product.id}
                    className="product-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    layout
                  >
                    <div className="product-image">
                      <img 
                        src={product.image || '/placeholder-product.jpg'} 
                        alt={product.name}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="price">${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</p>
                      <p className="description">{product.description}</p>
                      <div className="product-rating">
                        <Rating 
                          rating={Math.floor(Math.random() * 5) + 1} 
                          readOnly={true} 
                        />
                        <span>({Math.floor(Math.random() * 100)} reviews)</span>
                      </div>
                    </div>
                    <div className="product-actions">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product.id)}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOrderNow(product.id)}
                        className="order-now-btn"
                      >
                        Order Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              className="no-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="empty-icon">🔍</div>
              {searchQuery ? (
                <h3>No results for "<span>{searchQuery}</span>"</h3>
              ) : (
                <h3>No products available</h3>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserPanel;