import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import SellerPanel from './pages/SellerPanel'; // Add this import
import UserPanel from './pages/UserPanel'; // Add this import
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute roles={['user', 'seller', 'admin']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
              <PrivateRoute roles={['admin']}>
                <AdminPanel />
              </PrivateRoute>
              }
            />
            <Route
              path="/seller"
              element={
                <PrivateRoute roles={['seller']}>
                  <SellerPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute roles={['buyer']}>
                  <UserPanel />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;