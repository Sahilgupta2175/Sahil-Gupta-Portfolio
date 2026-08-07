import api, { buildFormData } from './api';

export const listProjects = (params = {}) =>
  api.get('/api/projects', { params }).then((r) => r.data);

export const createProject = (data) =>
  api.post('/api/projects', buildFormData(data)).then((r) => r.data);

export const updateProject = (id, data) =>
  api.put(`/api/projects/${id}`, buildFormData(data)).then((r) => r.data);

export const deleteProject = (id) =>
  api.delete(`/api/projects/${id}`).then((r) => r.data);
