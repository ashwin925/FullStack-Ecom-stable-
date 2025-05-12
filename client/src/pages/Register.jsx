// client/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await register(formData); 
      console.log('Registration Response:', response); 
      navigate('/dashboard'); 
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="register-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="register-card">
        <motion.div 
          className="register-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 style={{marginTop: '-20px'}}>Create Your Account</h2>
        </motion.div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label style={{marginTop: '-10px'}}>Full Name</label>
            <input
              style={{marginTop: '-10px'}}  
              type="text"
              placeholder="Enter your full name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label >Email Address</label>
            <input 
              style={{marginTop: '-10px'}}
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label>Password</label>
            <input
              style={{marginTop: '-10px'}}
              type="password"
              placeholder="Create a password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              minLength="6"
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label style={{marginBottom: '-5px'}}>Account Type</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${formData.role === 'buyer' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'buyer' })}
              >
                Buyer
              </button>
              <button
                type="button"
                className={`role-btn ${formData.role === 'seller' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'seller' })}
              >
                Seller
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            style={{marginTop: '-5px'}}
            disabled={isLoading}
            className="register-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : 'Register'}
          </motion.button>
        </form>

        <motion.div   
          className="register-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p style={{marginTop: '-10px'}}>Already have an account? <Link to="/login">Sign in</Link></p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;