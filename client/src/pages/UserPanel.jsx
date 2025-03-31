import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationTriangle } from 'react-icons/fa';

const UserPanel = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products', { withCredentials: true });
        setProducts(data);
      } catch(err) {
        toast.error('Failed to load products');
        console.error('Fetch products error:', err);
      }
    };
    fetchProducts();
  }, []);

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
          </div>
        </div>
      </div>

      <div className="products-section">
        <h2>Available Products</h2>
        {products.length > 0 ? (
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
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default UserPanel;