import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        const res = await axios.get('/auth/me'); // Add this endpoint in your backend
        setUser(res.data);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
    } catch (err) {
      throw err.response.data.message;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
    } catch (err) {
      throw err.response.data.message;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);