// src/utils/jwt.js
export const getUserFromToken = () => {
  const token = localStorage.getItem('jwt_token');

  // 🔧 Здесь заглушка: если токен соответствует строке — считаем, что пользователь авторизован
  if (token === 'lapida_admin_token') {
    return {
      name: 'Администратор',
      email: 'admin@lapida.one',
      role: 'admin',
    };
  }

  return null;
};
