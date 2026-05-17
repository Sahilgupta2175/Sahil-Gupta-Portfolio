import api from './api';

// Public: sign someone up to the "Stay Updated" list.
export const subscribe = (email) =>
  api.post('/api/subscribers', { email }).then((r) => r.data);

// Admin-only: list all subscribers (active + unsubscribed).
export const listSubscribers = () =>
  api.get('/api/subscribers/admin').then((r) => r.data);

export const deleteSubscriber = (id) =>
  api.delete(`/api/subscribers/${id}`).then((r) => r.data);
