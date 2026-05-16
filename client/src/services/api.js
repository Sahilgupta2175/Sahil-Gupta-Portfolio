import axios from 'axios';
import API_BASE_URL from '../config/api';

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

export default api;
