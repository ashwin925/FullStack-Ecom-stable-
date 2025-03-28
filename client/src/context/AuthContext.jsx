import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const { data } = await axios.get('/api/auth/me', { withCredentials: true });
      setUser(data);
    } catch (error) {
      console.error('Auth check failed:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      const response = await axios.post('/api/auth/login', formData, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login response:', response.data); // Debug log
      
      // Manually set user data if session isn't working
      const user = response.data;
      setUser(user);
      
      // Store in localStorage as fallback
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post('/api/auth/register', formData, { withCredentials: true });
      return response.data; // Return the response data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);