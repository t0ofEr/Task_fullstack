const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'task_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(username, password) {
  // Compatible con simplejwt (/api/auth/token/) y DRF TokenAuth (/api/auth/login/)
  const res = await fetch(`${BASE_URL}/api/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || 'Credenciales inválidas');
  }

  const data = await res.json();
  const token = data.access || data.token;
  if (!token) throw new Error('Respuesta de autenticación inesperada');
  saveToken(token);
  return token;
}

export function logout() {
  clearToken();
}
