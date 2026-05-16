import api from './api';

export const login = ({ email, password }) =>
  api.post('/api/auth/login', { email, password }).then((r) => r.data);

export const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_email');
};

export const isAuthed = () => Boolean(localStorage.getItem('admin_token'));
