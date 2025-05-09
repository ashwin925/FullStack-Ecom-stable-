import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import SellerPanel from './pages/SellerPanel';
import UserPanel from './pages/UserPanel';
import CartPage from './pages/CartPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './layouts/MainLayout';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <motion.div 
      className="error-fallback"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="error-content">
        <h2>Something went wrong</h2>
        <pre className="error-message">{error.message}</pre>
        <button 
          onClick={resetErrorBoundary}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login />
          </motion.div>
        } />
        
        <Route path="/register" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Register />
          </motion.div>
        } />
        
        <Route path="/forgot-password" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ForgotPassword />
          </motion.div>
        } />
        
        <Route path="/reset-password/:token" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResetPassword />
          </motion.div>
        } />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={['user', 'seller', 'admin']}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Dashboard />
                </motion.div>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['admin']}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AdminPanel />
                </motion.div>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/seller"
            element={
              <PrivateRoute roles={['seller']}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SellerPanel />
                </motion.div>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/user"
            element={
              <PrivateRoute roles={['buyer']}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UserPanel />
                </motion.div>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/cart"
            element={
              <PrivateRoute roles={['buyer']}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CartPage />
                </motion.div>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/orders"
            element={
              <PrivateRoute roles={['buyer']}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <OrderHistoryPage />
                </motion.div>
              </PrivateRoute>
            }
          />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={
          <motion.div
            className="not-found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Router>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <AnimatedRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;