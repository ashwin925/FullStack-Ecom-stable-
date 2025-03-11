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
      const { data } = await axios.get('/auth/me'); // Changed endpoint
      setUser(data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };
  
  const login = async (formData) => {
    const { data } = await axios.post('/auth/login', formData);
    setUser(data);
  };
  
  const logout = async () => {
    await axios.post('/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const register = async (formData) => {
    try {
      const { data } = await axios.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('token');
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);