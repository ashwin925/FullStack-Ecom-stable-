import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductFilters from './ProductFilters';

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

  // Load products with filters
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
        
        // Clean params object (remove empty values)
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

  // Initialize profile data when user changes
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
      await axios.post('/api/cart', { productId, quantity: 1 }, { withCredentials: true });
      toast.success('Product added to cart!');
    } catch (error) {
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

  return (
    <div className="user-panel">
      <ToastContainer />
      <h1>Welcome, {user?.name}!</h1>

      <div className="profile-section">
        {editMode ? (
          <form onSubmit={handleProfileSubmit} className="profile-edit-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Birthday:</label>
              <input
                type="date"
                name="dob"
                value={profileData.dob}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Gender:</label>
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
              <button type="submit" className="save-btn">Save Changes</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-display">
            <img 
              src={user?.profilePictureUrl || '/default-profile.png'} 
              alt="Profile" 
              className="profile-image"
            />
            <div className="profile-details">
              <h3>{user?.name}</h3>
              <p><strong>Email:</strong> {user?.email}</p>
              {user?.phone && <p><strong>Phone:</strong> {user.phone}</p>}
              {user?.dob && <p><strong>Birthday:</strong> {new Date(user.dob).toLocaleDateString()}</p>}
              <p><strong>Gender:</strong> {user?.gender || 'Not specified'}</p>
              <p><strong>Account Type:</strong> {user?.role}</p>
              <button 
                onClick={() => setEditMode(true)}
                className="edit-profile-btn"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="products-section">
        <h2>Available Products</h2>
        <ProductFilters />
        
        {loading ? (
          <p className="loading-message">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="price">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </p>
                <p className="description">{product.description}</p>
                <button 
                  onClick={() => addToCart(product.id)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products-message">
            {searchQuery ? (
              <p>Sorry, no products found for "<strong>{searchQuery}</strong>"</p>
            ) : (
              <p>No products available matching your filters</p>
            )}
            <button 
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;