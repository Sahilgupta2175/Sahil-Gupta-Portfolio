import api from './api';

export const listExperience = () =>
  api.get('/api/experience').then((r) => r.data);

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

export const createExperience = (data) =>
  api.post('/api/experience', buildFormData(data)).then((r) => r.data);

export const updateExperience = (id, data) =>
  api.put(`/api/experience/${id}`, buildFormData(data)).then((r) => r.data);

export const deleteExperience = (id) =>
  api.delete(`/api/experience/${id}`).then((r) => r.data);
