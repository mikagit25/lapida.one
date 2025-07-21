import { createContext, useContext, useState, useEffect } from 'react';
import { updateUserProfile } from '../services/authService';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  const updateProfile = async (newData) => {
    try {
      const updated = await updateUserProfile(newData);
      setProfile(updated);
      localStorage.setItem('profile', JSON.stringify(updated));
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
