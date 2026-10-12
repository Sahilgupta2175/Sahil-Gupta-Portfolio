import api, { buildFormData } from './api';

export const listBlogs = (params = {}) =>
  api.get('/api/blogs', { params }).then((r) => r.data);

// Create/update can email subscribers before responding, so allow extra time.
export const createBlog = (data) =>
  api.post('/api/blogs', buildFormData(data), { timeout: 120000 }).then((r) => r.data);

export const updateBlog = (id, data) =>
  api.put(`/api/blogs/${id}`, buildFormData(data), { timeout: 120000 }).then((r) => r.data);

// Admin-only: email this post to every active subscriber now.
export const notifyBlogSubscribers = (id) =>
  api.post(`/api/blogs/${id}/notify`, null, { timeout: 120000 }).then((r) => r.data);

export const deleteBlog = (id) =>
  api.delete(`/api/blogs/${id}`).then((r) => r.data);
