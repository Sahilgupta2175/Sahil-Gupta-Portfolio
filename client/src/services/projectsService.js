import api from './api';

export const listProjects = (params = {}) =>
  api.get('/api/projects', { params }).then((r) => r.data);

export const getProject = (id) =>
  api.get(`/api/projects/${id}`).then((r) => r.data);

// Admin — multipart so the optional image file rides along.
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

export const createProject = (data) =>
  api.post('/api/projects', buildFormData(data)).then((r) => r.data);

export const updateProject = (id, data) =>
  api.put(`/api/projects/${id}`, buildFormData(data)).then((r) => r.data);

export const deleteProject = (id) =>
  api.delete(`/api/projects/${id}`).then((r) => r.data);
