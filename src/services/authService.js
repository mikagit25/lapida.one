// src/services/authService.js

export async function loginUser(credentials) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error('Ошибка авторизации');
  return await response.json();
}

export async function registerUser(data) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Ошибка регистрации');
  return await response.json();
}

export async function updateUserProfile(data) {
  const response = await fetch('/api/profile/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Ошибка обновления профиля');
  return await response.json();
}
