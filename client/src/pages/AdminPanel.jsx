// client/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import "./AdminPanel.css";

const AdminPanel = () => {
  const { user } = useAuth(); // Now actually used in the component
  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch permission requests
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get('/api/admin/requests');
      setRequests(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load requests');
    }
  };

  // Approve/reject handlers
  const handleApprove = async (requestId) => {
    try {
      await axios.put(`/api/admin/requests/${requestId}/approve`);
      setSuccess('Request approved!');
      fetchRequests();
    } catch (error) {
      setError(error.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`/api/admin/requests/${requestId}/reject`);
      setSuccess('Request rejected!');
      fetchRequests();
    } catch (error) {
      setError(error.response?.data?.message || 'Rejection failed');
    }
  };

  useEffect(() => {
    if (showRequests) fetchRequests();
  }, [showRequests]);

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      {/* Added welcome message with user's name */}
      {user && <p className="welcome-message">Welcome back, <strong>{user.name}</strong>!</p>}
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <button 
        onClick={() => setShowRequests(!showRequests)}
        className={requests.length > 0 ? 'has-requests' : ''}
      >
        {requests.length > 0 ? `Permission Requests (${requests.length})` : 'View Requests'}
      </button>

      {showRequests && (
        <div className="requests-list">
          <h2>Pending Requests</h2>
          {requests.length > 0 ? (
            <ul>
              {requests.map((req) => (
                <li key={req._id}>
                  <p><strong>User:</strong> {req.userName}</p>
                  <p><strong>Current Email:</strong> {req.oldEmail}</p>
                  <p><strong>New Email:</strong> {req.newEmail}</p>
                  <p><strong>Reason:</strong> {req.description}</p>
                  <div className="request-actions">
                    <button onClick={() => handleApprove(req._id)}>Approve</button>
                    <button onClick={() => handleReject(req._id)}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending requests.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;