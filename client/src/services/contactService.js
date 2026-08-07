import api from './api';

// Public: contact form submission.
export const sendContactMessage = (data) =>
  api.post('/api/contact', data).then((r) => r.data);
