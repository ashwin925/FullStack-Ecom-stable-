// client/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Header from '../components/Header';
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
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-register-page">
      <Header />
      
      {/* Holographic background elements */}
      <div className="holographic-bg-elements">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="holographic-circle"
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{
              background: `conic-gradient(
                from ${Math.random() * 360}deg,
                rgba(79, 70, 229, 0.3),
                rgba(124, 58, 237, 0.3),
                transparent
              )`,
              filter: `blur(${10 + Math.random() * 10}px)`,
              mixBlendMode: 'overlay'
            }}
          />
        ))}
      </div>

      <motion.div 
        className="glass-register-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="glass-register-card"
          initial={{ y: 20, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 15
          }}
          whileHover={{
            boxShadow: '0 12px 36px rgba(79, 70, 229, 0.2)'
          }}
        >
          <motion.div 
            className="register-header"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h2
              animate={{
                background: [
                  'linear-gradient(90deg, #4f46e5, #7c3aed)',
                  'linear-gradient(90deg, #7c3aed, #4f46e5)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
              }}
            >
              Create Your Account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Join us today and start your journey
            </motion.p>
          </motion.div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <motion.div
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label>Full Name</label>
              <motion.input
                type="text"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                whileFocus={{
                  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
                  borderColor: '#4f46e5'
                }}
              />
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label>Email Address</label>
              <motion.input
                type="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                whileFocus={{
                  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
                  borderColor: '#4f46e5'
                }}
              />
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label>Password</label>
              <motion.input
                type="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength="6"
                whileFocus={{
                  boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
                  borderColor: '#4f46e5'
                }}
              />
              <p className="password-hint">Minimum 6 characters</p>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label>Account Type</label>
              <div className="role-selector">
                <motion.button
                  type="button"
                  className={`role-btn ${formData.role === 'buyer' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Buyer
                </motion.button>
                <motion.button
                  type="button"
                  className={`role-btn ${formData.role === 'seller' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Seller
                </motion.button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="register-btn"
              whileHover={{
                scale: 1.03,
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {isLoading ? (
                <>
                  <motion.span
                    className="spinner"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  Creating Account...
                </>
              ) : (
                <motion.span
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'linear'
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #fff, #fff, #e0e7ff)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Register Now
                </motion.span>
              )}
            </motion.button>
          </form>

          <motion.div 
            className="register-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p>Already have an account? <Link to="/login" className="footer-link">Sign in</Link></p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;