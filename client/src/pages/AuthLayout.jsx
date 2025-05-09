// client/src/pages/AuthLayout.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="auth-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/" className="auth-logo">
            🚀 ShopEase
          </Link>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </motion.div>

        <div className="auth-content">
          {children}
        </div>

        <motion.div
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="auth-links">
            <Link to="/">Back to Home</Link>
            {title === 'Login' ? (
              <span>
                Don't have an account? <Link to="/register">Register</Link>
              </span>
            ) : (
              <span>
                Already have an account? <Link to="/login">Login</Link>
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="auth-decoration"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;