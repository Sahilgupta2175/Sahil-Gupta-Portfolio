import api from './api';

export const listBlogs = (params = {}) =>
  api.get('/api/blogs', { params }).then((r) => r.data);

export const getBlog = (slug) =>
  api.get(`/api/blogs/${slug}`).then((r) => r.data);

const buildFormData = (data) => {
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

export const createBlog = (data) =>
  api.post('/api/blogs', buildFormData(data)).then((r) => r.data);

export const updateBlog = (id, data) =>
  api.put(`/api/blogs/${id}`, buildFormData(data)).then((r) => r.data);

export const deleteBlog = (id) =>
  api.delete(`/api/blogs/${id}`).then((r) => r.data);
