import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/authService';

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t && t !== 'undefined' ? t : '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(credentials);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } catch (err) {
      setError('Ошибка входа: ' + (err.response?.data?.error || err.message || 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}