import { getToken, clearToken } from './auth';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new Event('auth:expired'));
    throw new Error('Sesión expirada. Por favor ingresa de nuevo.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Error ${res.status}`);
  }
  return res.json();
}

export function fetchTasks(status = '') {
  const query = status ? `?status=${status}` : '';
  return request(`/api/tasks/${query}`);
}

export function createTask(data) {
  return request('/api/tasks/', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTask(id, data) {
  return request(`/api/tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

