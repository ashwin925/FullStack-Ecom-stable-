import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import "./userPanel.css";

const UserPanel = () => {
  const { user, updateUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    profilePicture: null,
    profilePictureUrl: user?.profilePicture || ''
  });
  const [success, setSuccess] = useState('');

  // Fetch products (existing functionality)
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

  // Handle profile updates
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      if (formData.password) formPayload.append('password', formData.password);
      if (formData.profilePicture) {
        formPayload.append('profilePicture', formData.profilePicture);
      }

      const { data } = await axios.put('/api/users/me', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      updateUser(data);
      setSuccess('Profile updated successfully!');
      setError('');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setSuccess('');
    }
  };

  // Handle file upload preview
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

  // Add to cart (existing functionality)
  const addToCart = async (productId) => {
    try {
      await axios.post('/api/cart', { productId, quantity: 1 }, { withCredentials: true });
      alert('Product added to cart!');
    } catch (error) {
      setError(error.message || 'Failed to add product to cart');
    }
  };

  return (
    <div className="user-panel">
      <h1>Welcome, {user?.name}!</h1>
      <p>You are a buyer.</p>

      {/* Profile Section */}
      <div className="profile-section">
        {isEditing ? (
          <form onSubmit={handleProfileUpdate}>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div className="form-group">
              <label>Profile Picture</label>
              <img 
                src={formData.profilePictureUrl || '/default-profile.png'} 
                alt="Profile" 
                width="100"
              />
              <input type="file" onChange={handleFileChange} accept="image/*" />
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <div className="profile-display">
            <img 
              src={user?.profilePicture || '/default-profile.png'} 
              alt="Profile" 
              width="100"
            />
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        )}
      </div>

      {/* Products Section (existing) */}
      <h2>All Products</h2>
      {error && <div className="error">{error}</div>}
      {products.length > 0 ? (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
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