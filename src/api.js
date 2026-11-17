import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) => e.response?.data?.message || e.message;
export const fmt = (d) => (d ? new Date(d).toLocaleString() : '');
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '');
export default api;
