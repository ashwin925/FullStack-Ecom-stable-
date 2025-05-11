// pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Header from '../components/Header';
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
    <div className="glass-login-page">
      <Header />
      
      {/* Enhanced floating background elements */}
      <div className="glass-bg-elements">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="glass-bg-circle"
            animate={{
              y: [0, Math.random() * 60 - 30],
              x: [0, Math.random() * 60 - 30],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 12 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            style={{
              width: `${100 + Math.random() * 150}px`,
              height: `${100 + Math.random() * 150}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, 
                rgba(${Math.floor(Math.random() * 100) + 155}, 
                ${Math.floor(Math.random() * 100) + 155}, 
                ${Math.floor(Math.random() * 100) + 155}, 
                ${Math.random() * 0.2 + 0.1}) 0%, 
                transparent 70%)`,
              filter: `blur(${Math.random() * 10 + 10}px)`,
              mixBlendMode: 'overlay'
            }}
          />
        ))}
      </div>

      <motion.div 
        className="glass-login-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="glass-login-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ 
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            backdropFilter: 'blur(12px) saturate(180%)'
          }}
        >
          <motion.div 
            className="glass-login-header"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.h2
  animate={{ 
    textShadow: [
      '0 0 8px rgba(102, 126, 234, 0.3)',
      '0 0 16px rgba(102, 126, 234, 0.5)',
      '0 0 8px rgba(102, 126, 234, 0.3)'
    ]
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut'
  }}
  style={{
    background: 'linear-gradient(90deg, #4f46e5, #9333ea)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block'
  }}
>
  Welcome Back
</motion.h2>
            <p>Enter your credentials to access your account</p>
          </motion.div>

          {error && (
            <motion.div 
              className="glass-error-message"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="glass-login-form">
            <motion.div
              className="glass-form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
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
              className="glass-form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
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
              className="glass-login-btn"
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {isLoading ? (
                <>
                  <span className="glass-spinner"></span>
                  Logging in...
                </>
              ) : 'Login'}
            </motion.button>
          </form>

          <motion.div 
            className="glass-login-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            <Link to="/forgot-password" className="glass-forgot-password">
              Forgot password?   
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;