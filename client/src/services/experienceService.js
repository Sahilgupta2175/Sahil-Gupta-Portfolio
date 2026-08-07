import api, { buildFormData } from './api';

export const listExperience = () =>
  api.get('/api/experience').then((r) => r.data);

export const createExperience = (data) =>
  api.post('/api/experience', buildFormData(data)).then((r) => r.data);

export const updateExperience = (id, data) =>
  api.put(`/api/experience/${id}`, buildFormData(data)).then((r) => r.data);

export const deleteExperience = (id) =>
  api.delete(`/api/experience/${id}`).then((r) => r.data);
