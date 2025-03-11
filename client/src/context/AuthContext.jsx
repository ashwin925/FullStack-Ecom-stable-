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
    }
    setLoading(false);
  };
  
  const login = async (formData) => {
    try {
      await axios.post('/auth/login', formData, { withCredentials: true });
      await checkUserLoggedIn(); // Force refresh user state
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };
  
  const logout = async () => {
    await axios.post('/auth/logout');
    setUser(null);
  };
  
  const register = async (formData) => {
    try {
      await axios.post('/auth/register', formData, { withCredentials: true });
      await checkUserLoggedIn(); // Force refresh user state
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