import api, { buildFormData } from './api';

export const listProjects = (params = {}) =>
  api.get('/api/projects', { params }).then((r) => r.data);

// Creating a project emails subscribers before responding, so allow extra time.
export const createProject = (data) =>
  api.post('/api/projects', buildFormData(data), { timeout: 120000 }).then((r) => r.data);

export const updateProject = (id, data) =>
  api.put(`/api/projects/${id}`, buildFormData(data)).then((r) => r.data);

export const deleteProject = (id) =>
  api.delete(`/api/projects/${id}`).then((r) => r.data);
