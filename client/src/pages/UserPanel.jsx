import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const UserPanel = () => {
  const { user, updateUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePicture: null,
    profilePictureUrl: user?.profilePicture || ''
  });
  const [permissionRequest, setPermissionRequest] = useState({
    oldEmail: user?.email || '',
    newEmail: '',
    oldPassword: '',
    newPassword: '',
    description: ''
  });
  const [success, setSuccess] = useState('');

  // Fetch products (existing)
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

  // Handle profile updates (name/picture only)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
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
      setSuccess('Profile updated successfully!');
      setError('');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setSuccess('');
    }
  };

  // Handle permission request submission
  const handlePermissionRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/requests', {
        userId: user._id,
        userName: user.name,
        ...permissionRequest
      }, { withCredentials: true });

      setSuccess('Permission request sent to Admin!');
      setError('');
      setShowPermissionForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  // File upload preview
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

  // Add to cart (existing)
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

      {/* Profile Section */}
      <div className="profile-section">
        {isEditing ? (
          <>
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
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                />
                <span className="permission-tag">* Requires Admin Permission</span>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="********"
                  disabled
                />
                <span className="permission-tag">* Requires Admin Permission</span>
              </div>

              <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                <button 
                  type="button" 
                  className="request-btn"
                  onClick={() => setShowPermissionForm(true)}
                >
                  Request Permission
                </button>
              </div>
            </form>

            {/* Permission Request Form (Popup) */}
            {showPermissionForm && (
              <div className="permission-popup">
                <h3>Request Admin Permission</h3>
                <form onSubmit={handlePermissionRequest}>
                  <div className="form-group">
                    <label>Current Email *</label>
                    <input
                      type="email"
                      value={permissionRequest.oldEmail}
                      onChange={(e) => setPermissionRequest({ 
                        ...permissionRequest, 
                        oldEmail: e.target.value 
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Email *</label>
                    <input
                      type="email"
                      value={permissionRequest.newEmail}
                      onChange={(e) => setPermissionRequest({ 
                        ...permissionRequest, 
                        newEmail: e.target.value 
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Current Password *</label>
                    <input
                      type="password"
                      value={permissionRequest.oldPassword}
                      onChange={(e) => setPermissionRequest({ 
                        ...permissionRequest, 
                        oldPassword: e.target.value 
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password *</label>
                    <input
                      type="password"
                      value={permissionRequest.newPassword}
                      onChange={(e) => setPermissionRequest({ 
                        ...permissionRequest, 
                        newPassword: e.target.value 
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Reason for Change *</label>
                    <textarea
                      value={permissionRequest.description}
                      onChange={(e) => setPermissionRequest({ 
                        ...permissionRequest, 
                        description: e.target.value 
                      })}
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit">Submit Request</button>
                    <button 
                      type="button" 
                      onClick={() => setShowPermissionForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
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