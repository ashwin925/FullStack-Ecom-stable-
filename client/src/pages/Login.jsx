import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await login(formData);
      const { role } = response;
  
      switch(role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'seller':
          navigate('/seller');
          break;
        case 'buyer':
          navigate('/user');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Animation Elements */}
      <div className="login-bg-elements">
        <motion.div 
          className="bg-circle-1"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="bg-circle-2"
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="bg-circle-3"
          animate={{
            y: [0, 25, 0],
            x: [0, -20, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Left Side - Branding */}
        <motion.div 
          className="login-branding"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="brand-logo">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 15, 
                ease: "linear" 
              }}
            >
              🚀
            </motion.span>
          </div>
          <h1>Welcome to ShopSphere</h1>
          <p>Your premier destination for all shopping needs. Join thousands of satisfied customers today.</p>
          
          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">Lightning fast checkout</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <div className="feature-text">Secure transactions</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <div className="feature-text">Fast delivery</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          className="login-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="login-card">
            <motion.div 
              className="login-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2>Welcome Back</h2>
              <p>Please enter your credentials to login</p>
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

            <form onSubmit={handleSubmit} className="login-form">
              <motion.div
                className="form-group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label>Email</label>
                <input
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
                transition={{ delay: 0.3 }}
              >
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength="6"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="login-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : 'Login'}
              </motion.button>
            </form>

            <div className="login-options">
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <motion.div 
              className="login-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;