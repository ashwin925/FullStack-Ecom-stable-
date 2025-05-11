// components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    !user && { path: '/login', name: 'Login', icon: '🔐' },
    !user && { path: '/register', name: 'Register', icon: '📝' },
    user && { path: '/cart', name: 'Cart', icon: '🛒' },
    user && { path: '/orders', name: 'Orders', icon: '📦' },
    user && { path: '/logout', name: 'Logout', icon: '🚪', action: logout }
  ].filter(Boolean);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-header"
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <motion.span 
            className="logo-icon"
            animate={{ 
              rotate: [0, 5, -5, 0],
              textShadow: [
                '0 0 8px rgba(102, 126, 234, 0.3)',
                '0 0 12px rgba(102, 126, 234, 0.5)',
                '0 0 8px rgba(102, 126, 234, 0.3)'
              ]
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 6, ease: "linear" },
              textShadow: { duration: 4, repeat: Infinity, repeatType: 'reverse' }
            }}
          >
            ✨
          </motion.span>
          <motion.span 
            className="logo-text"
            animate={{
              textShadow: [
                '0 2px 4px rgba(0, 0, 0, 0.1)',
                '0 4px 8px rgba(0, 0, 0, 0.15)',
                '0 2px 4px rgba(0, 0, 0, 0.1)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          >
            GlassShop
          </motion.span>
        </Link>
        
        <nav className="nav-links">
          {navLinks.map((link) => (
            <motion.div
              key={link.path}
              whileHover={{ 
                y: -2,
                scale: 1.05
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {link.action ? (
                <motion.button 
                  onClick={link.action} 
                  className="nav-link"
                  whileHover={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <span className="nav-icon">{link.icon}</span>
                  {link.name}
                </motion.button>
              ) : (
                <motion.div
                  whileHover={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <Link 
                    to={link.path}
                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    {link.name}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;