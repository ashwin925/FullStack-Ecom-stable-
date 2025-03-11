import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import { ErrorBoundary } from 'react-error-boundary';

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
    <>
    <ErrorBoundary FallbackComponent={ErrorFallback}></ErrorBoundary><Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute roles={['user', 'seller', 'admin']}>
              <Dashboard />
            </PrivateRoute>} />
          <Route
            path="/admin"
            element={<AdminRoute>
              <AdminPanel />
            </AdminRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
    </>

  );
}

export default App;