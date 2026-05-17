import api from './api';

// Public list — only active items, newest first
export const listCurrentWork = () =>
  api.get('/api/current-work').then((r) => r.data);

// Admin list — includes hidden items
export const listAllCurrentWork = () =>
  api.get('/api/current-work/all').then((r) => r.data);

export const createCurrentWork = (data) =>
  api.post('/api/current-work', data).then((r) => r.data);

export const updateCurrentWork = (id, data) =>
  api.put(`/api/current-work/${id}`, data).then((r) => r.data);

export const deleteCurrentWork = (id) =>
  api.delete(`/api/current-work/${id}`).then((r) => r.data);
