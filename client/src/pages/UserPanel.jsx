import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationTriangle } from 'react-icons/fa';

const UserPanel = () => {
  const { user, updateUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePicture: null,
    profilePictureUrl: user?.profilePicture || ''
  });
  const [hasChangedName, setHasChangedName] = useState(user?.hasChangedName || false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products', { withCredentials: true });
        setProducts(data);
      } catch {
        toast.error('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (hasChangedName && formData.name !== user.name) {
        toast.error('You can only change your name once!');
        return;
      }

      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      
      if (formData.profilePicture) {
        formPayload.append('profilePicture', formData.profilePicture);
      }

      const { data } = await axios.put('/api/users/me', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      updateUser(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      if (formData.name !== user.name) {
        setHasChangedName(true);
        // Update backend to remember name was changed
        await axios.patch(`/api/users/${user.id}`, { hasChangedName: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file,
        profilePictureUrl: URL.createObjectURL(file)
      });
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post('/api/cart', { productId, quantity: 1 }, { withCredentials: true });
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="user-panel">
      <ToastContainer />
      <h1>Welcome, {user?.name}!</h1>

      <div className="profile-section">
        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            {hasChangedName && formData.name !== user.name && (
              <div className="name-change-warning" style={{
                backgroundColor: '#ffebee',
                border: '1px solid #f44336',
                color: '#f44336',
                padding: '10px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '10px 0'
              }}>
                <FaExclamationTriangle />
                <span>You can change your name only once!</span>
              </div>
            )}
            <div className="form-group">
              <label>Profile Picture</label>
              <img 
                src={formData.profilePictureUrl || '/default-profile.png'} 
                alt="Profile" 
                className="profile-image"
              />
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*"
                className="file-input"
              />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                disabled={hasChangedName && formData.name !== user.name}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-display">
            <img 
              src={user?.profilePicture || '/default-profile.png'} 
              alt="Profile" 
              className="profile-image"
            />
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="products-section">
        <h2>Available Products</h2>
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
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
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default UserPanel;