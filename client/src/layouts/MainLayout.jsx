// client/src/layouts/MainLayout.jsx
import { motion } from 'framer-motion';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', name: 'Home', icon: '🏠' },
    { path: '/products', name: 'Products', icon: '🛍️' },
    user?.role === 'seller' && { path: '/seller', name: 'Seller', icon: '👨‍💼' },
    user?.role === 'admin' && { path: '/admin', name: 'Admin', icon: '🔒' },
    user ? { path: '/profile', name: 'Profile', icon: '👤' } : null,
  ].filter(Boolean);

  return (
    <div className="app-container">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="app-header"
      >
        <Link to="/" className="logo">
          <motion.span 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🚀
          </motion.span>
          <span>ShopEase</span>
        </Link>
        
        <nav className="nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="auth-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn">
                🛒 Cart
              </Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </motion.header>

      <main className="main-content">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <motion.footer 
        className="app-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        <div className="social-links">
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="Facebook">👍</a>
          <a href="#" aria-label="Instagram">📸</a>
        </div>
      </motion.footer>
    </div>
  );
};

export default MainLayout;