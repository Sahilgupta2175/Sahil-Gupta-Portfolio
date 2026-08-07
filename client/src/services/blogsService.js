import api, { buildFormData } from './api';

export const listBlogs = (params = {}) =>
  api.get('/api/blogs', { params }).then((r) => r.data);

export const createBlog = (data) =>
  api.post('/api/blogs', buildFormData(data)).then((r) => r.data);

export const updateBlog = (id, data) =>
  api.put(`/api/blogs/${id}`, buildFormData(data)).then((r) => r.data);

export const deleteBlog = (id) =>
  api.delete(`/api/blogs/${id}`).then((r) => r.data);
