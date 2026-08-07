import axios from 'axios';

// Backend URL. Swap to http://localhost:5000 for local development.
export const API_BASE_URL = 'https://sahil-gupta-portfolio-backend.vercel.app';

// Single axios instance. The admin JWT (if any) is read from localStorage
// on every request so freshly-issued tokens take effect immediately.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 from a protected endpoint, drop the stale token so the admin UI
// can redirect back to /admin/login.
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
    }
    return Promise.reject(err);
  }
);

// Admin writes go up as multipart so an optional image file rides along.
// Arrays are JSON-stringified; the server parses them back (parseArrayField).
export const buildFormData = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'image' && v instanceof File) {
      fd.append('image', v);
    } else if (Array.isArray(v)) {
      fd.append(k, JSON.stringify(v));
    } else {
      fd.append(k, v);
    }
  });
  return fd;
};

export default api;
