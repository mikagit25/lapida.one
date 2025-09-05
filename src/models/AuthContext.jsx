import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Sync context with localStorage on mount and when localStorage changes
  useEffect(() => {
    const sync = () => {
      console.log('AuthContext: синхронизация с localStorage');
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      console.log('AuthContext: storedUser =', storedUser);
      console.log('AuthContext: storedToken =', storedToken);
      
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('AuthContext: установлен пользователь =', parsedUser);
        } catch (e) {
          console.error('AuthContext: ошибка парсинга пользователя', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
        setToken(storedToken);
        console.log('AuthContext: установлен токен =', storedToken);
      } else {
        setToken('');
      }
      
      setLoading(false);
      console.log('AuthContext: загрузка завершена');
    };
    
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const login = ({ user, token }) => {
    console.log('AuthContext login: получены данные', { user, token });
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    console.log('AuthContext login: данные сохранены в localStorage');
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('AuthContext logout');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);