import React from 'react';
import { useAuth } from '../context/AuthContext';
import "./AdminPanel.css";

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      {user && <p className="welcome-message">Welcome back, <strong>{user.name}</strong>!</p>}
      
      <div className="admin-features">
        <h2>Administration Tools</h2>
        <div className="admin-cards">
          <div className="admin-card">
            <h3>User Management</h3>
            <p>View and manage all users</p>
          </div>
          <div className="admin-card">
            <h3>Product Oversight</h3>
            <p>Monitor all products</p>
          </div>
          <div className="admin-card">
            <h3>System Settings</h3>
            <p>Configure application settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;