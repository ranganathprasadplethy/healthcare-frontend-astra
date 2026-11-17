import { createContext, useContext, useEffect, useState } from 'react';
import api from './api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // { user, patient, doctor }
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  const refresh = () =>
    api.get('/auth/me').then((r) => setAuth(r.data)).catch(() => { localStorage.removeItem('token'); setAuth(null); });

  useEffect(() => {
    if (localStorage.getItem('token')) refresh().finally(() => setLoading(false));
  }, []);

  const start = ({ token, ...session }) => { localStorage.setItem('token', token); setAuth(session); };
  const login = async (email, password) => start((await api.post('/auth/login', { email, password })).data);
  const register = async (form) => start((await api.post('/auth/register', form)).data);
  const logout = () => { localStorage.removeItem('token'); setAuth(null); };

  return <AuthContext.Provider value={{ auth, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
}
