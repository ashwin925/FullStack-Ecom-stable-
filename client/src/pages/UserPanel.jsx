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
      transition={{ duration: 0.5 }}
    >
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Enhanced page background with animated gradient */}
      <motion.div 
        className="page-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="gradient-circle top-left"
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
          className="gradient-circle bottom-right"
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
      </motion.div>

      {/* Enhanced welcome title with floating animation */}
      <motion.div
        className="panel-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 100,
          damping: 10
        }}
      >
        <motion.h1
          className="panel-title"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            textShadow: [
              '0 2px 10px rgba(102, 126, 234, 0.2)',
              '0 4px 20px rgba(102, 126, 234, 0.3)',
              '0 2px 10px rgba(102, 126, 234, 0.2)'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          style={{
            background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #4f46e5)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block'
          }}
        >
          Welcome, {user?.name}!
        </motion.h1>
        <motion.p
          className="panel-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Explore and shop from our amazing collection
        </motion.p>
      </motion.div>

      <div className="panel-content">
        {/* Profile Section with enhanced animations */}
        <motion.div 
          className="profile-section glass-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            delay: 0.2, 
            type: 'spring',
            stiffness: 120,
            damping: 15
          }}
          whileHover={{ 
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
            transform: 'translateY(-5px)'
          }}
        >
          <div className="section-header">
            <motion.h2
              animate={{
                textShadow: [
                  '0 0 8px rgba(102, 126, 234, 0.1)',
                  '0 0 15px rgba(102, 126, 234, 0.3)',
                  '0 0 8px rgba(102, 126, 234, 0.1)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              Your Profile
            </motion.h2>
            
            {!editMode && (
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  background: '#4f46e5',
                  color: 'white'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(true)}
                className="edit-btn"
                style={{
                  background: 'rgba(79, 70, 229, 0.1)',
                  color: '#4f46e5'
                }}
              >
                Edit Profile
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {editMode ? (
              <motion.form 
                onSubmit={handleProfileSubmit}
                className="profile-edit-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                {['name', 'phone', 'dob', 'gender'].map((field, index) => (
                  <motion.div
                    key={field}
                    className="form-group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.1 * index,
                      type: 'spring',
                      stiffness: 200
                    }}
                  >
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    {field === 'gender' ? (
                      <select
                        name={field}
                        value={profileData[field]}
                        onChange={handleInputChange}
                        className="glass-input"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    ) : (
                      <input
                        type={field === 'dob' ? 'date' : field === 'phone' ? 'tel' : 'text'}
                        name={field}
                        value={profileData[field]}
                        onChange={handleInputChange}
                        className="glass-input"
                        required={field === 'name'}
                        placeholder={field === 'phone' ? 'Optional' : ''}
                      />
                    )}
                  </motion.div>
                ))}

                <div className="form-actions">
                  <motion.button 
                    type="submit"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 5px 20px rgba(79, 70, 229, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="save-btn"
                    style={{
                      background: 'linear-gradient(90deg, #4f46e5, #7c3aed)'
                    }}
                  >
                    Save Changes
                  </motion.button>
                  <motion.button 
                    type="button" 
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                    }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="profile-info">
                  <motion.div 
                    className="profile-image"
                    whileHover={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  >
                    <img 
                      src={user?.profilePictureUrl || '/default-profile.png'} 
                      alt="Profile" 
                    />
                  </motion.div>
                  <div className="profile-details">
                    <h3>{user?.name}</h3>
                    {['email', 'phone', 'dob', 'gender', 'role'].map((field) => (
                      user?.[field] && (
                        <p key={field}>
                          <span>{field.charAt(0).toUpperCase() + field.slice(1)}:</span> {
                            field === 'dob' ? 
                            new Date(user.dob).toLocaleDateString() : 
                            field === 'gender' ? 
                            user.gender === 'prefer-not-to-say' ? 'Prefer not to say' : user.gender :
                            user[field]
                          }
                        </p>
                      )
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Section with enhanced animations */}
        <motion.div 
          className="products-section glass-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3, 
            type: 'spring',
            stiffness: 100,
            damping: 15
          }}
          whileHover={{ 
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)'
          }}
        >
          <div className="section-header">
            <motion.h2
              animate={{
                textShadow: [
                  '0 0 8px rgba(102, 126, 234, 0.1)',
                  '0 0 15px rgba(102, 126, 234, 0.3)',
                  '0 0 8px rgba(102, 126, 234, 0.1)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              Available Products
            </motion.h2>
            <ProductFilters />
          </div>

          {loading ? (
            <motion.div 
              className="loading-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  width: 50,
                  height: 50,
                  border: '5px solid #e2e8f0',
                  borderTopColor: '#4f46e5',
                  borderRightColor: '#4f46e5',
                  borderRadius: '50%'
                }}
              />
              <motion.p
                animate={{
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                Loading products...
              </motion.p>
            </motion.div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              <AnimatePresence>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="product-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        delay: 0.05 * (index % 4),
                        type: 'spring',
                        stiffness: 300
                      }
                    }}
                    whileHover={{ 
                      y: -10,
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <motion.div 
                      className="product-image"
                      whileHover={{ scale: 1.03 }}
                    >
                      <img 
                        src={product.image || '/placeholder-product.jpg'} 
                        alt={product.name}
                      />
                    </motion.div>
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
                        whileHover={{ 
                          scale: 1.05,
                          background: '#4f46e5',
                          color: 'white'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product.id)}
                        className="add-to-cart-btn"
                        style={{
                          background: 'rgba(79, 70, 229, 0.1)',
                          color: '#4f46e5'
                        }}
                      >
                        Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 5px 20px rgba(79, 70, 229, 0.4)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOrderNow(product.id)}
                        className="order-now-btn"
                        style={{
                          background: 'linear-gradient(90deg, #4f46e5, #7c3aed)'
                        }}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { type: 'spring' }
              }}
            >
              <motion.div 
                className="empty-icon"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                🔍
              </motion.div>
              {searchQuery ? (
                <h3>No results for "<span>{searchQuery}</span>"</h3>
              ) : (
                <h3>No products available</h3>
              )}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  background: '#4f46e5',
                  color: 'white'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="clear-filters-btn"
                style={{
                  background: 'rgba(79, 70, 229, 0.1)',
                  color: '#4f46e5'
                }}
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