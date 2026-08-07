import api from './api';

// Public: the single About document, or null if the admin never saved one.
export const getAbout = () =>
  api.get('/api/about').then((r) => r.data);

// Admin-only: upserts that same document.
export const updateAbout = (data) =>
  api.put('/api/about', data).then((r) => r.data);
