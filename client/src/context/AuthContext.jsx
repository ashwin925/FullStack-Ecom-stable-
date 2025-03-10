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
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (formData) => {
    const res = await axios.post('/api/auth/login', formData);
    setUser(res.data);
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

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);