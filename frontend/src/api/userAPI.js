// src/api/userAPI.js
import api from './api';

// Login API function
export const loginUser = async (credentials) => {
  const res = await api.post('/api/users/login', credentials);
  return res.data;
};

// You can add register, logout, etc., the same way
export const registerUser = async (userData) => {
  const res = await api.post('/api/users/register', userData);
  return res.data;
};
