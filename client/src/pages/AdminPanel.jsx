// client/src/pages/AdminPanel.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();

  const adminFeatures = [
    {
      title: "User Management",
      description: "Manage all user accounts and permissions",
      icon: "👥",
      color: "bg-blue-500"
    },
    {
      title: "Product Oversight",
      description: "Monitor and moderate all products",
      icon: "📦",
      color: "bg-green-500"
    },
    {
      title: "System Settings",
      description: "Configure application settings",
      icon: "⚙️",
      color: "bg-purple-500"
    },
    {
      title: "Analytics Dashboard",
      description: "View platform statistics",
      icon: "📊",
      color: "bg-yellow-500"
    }
  ];

  return (
    <motion.div 
      className="admin-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-header">
        <motion.h1 
          className="admin-title"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Admin Dashboard
        </motion.h1>
        {user && (
          <motion.p 
            className="welcome-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back, <span className="username">{user.name}</span>!
          </motion.p>
        )}
      </div>

      <div className="admin-content">
        <h2 className="section-title">Administration Tools</h2>
        <div className="features-grid">
          {adminFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`feature-card ${feature.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="recent-activity">
          <h2 className="section-title">Recent Activity</h2>
          <motion.div 
            className="activity-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Placeholder for activity feed */}
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-details">
                <p>New user registration</p>
                <span className="activity-time">2 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🛒</div>
              <div className="activity-details">
                <p>New order placed</p>
                <span className="activity-time">15 minutes ago</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;