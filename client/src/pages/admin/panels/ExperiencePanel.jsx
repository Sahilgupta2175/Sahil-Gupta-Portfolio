import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiSave, FiX, FiRefreshCw } from 'react-icons/fi';
import {
  listExperience,
  createExperience,
  updateExperience,
  deleteExperience
} from '../../../services/experienceService';
import ImageUpload from '../widgets/ImageUpload';

const toArr = (str) => (str || '').split(',').map((s) => s.trim()).filter(Boolean);
const fromArr = (arr) => (arr || []).join(', ');

const EMPTY = {
  _id: null,
  role: '',
  company: '',
  location: '',
  period: '',
  description: '',
  achievements: '',
  technologies: '',
  image: null,
  currentImage: ''
};

const ExperiencePanel = ({ refreshSignal = 0 }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = () => {
    setLoading(true);
    listExperience()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  // Re-fetch on initial mount AND whenever the dashboard bumps refreshSignal.
  useEffect(() => { refresh(); }, [refreshSignal]);

  const startEdit = (e) => {
    setForm({
      _id: e._id,
      role: e.role || '',
      company: e.company || '',
      location: e.location || '',
      period: e.period || '',
      description: e.description || '',
      // Achievements use newline as a separator in the textarea — friendlier than commas
      // for free-form bullet text. We translate to/from an array on save/load.
      achievements: (e.achievements || []).join('\n'),
      technologies: fromArr(e.technologies),
      image: null,
      currentImage: e.logo || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      role: form.role,
      company: form.company,
      location: form.location,
      period: form.period,
      description: form.description,
      achievements: (form.achievements || '').split('\n').map((s) => s.trim()).filter(Boolean),
      technologies: toArr(form.technologies)
    };
    if (form.image) payload.image = form.image;

    try {
      if (form._id) {
        await updateExperience(form._id, payload);
      } else {
        await createExperience(payload);
      }
      setForm(EMPTY);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this experience entry? This also removes its logo from Cloudinary.')) return;
    await deleteExperience(id);
    refresh();
  };

  return (
    <div className="admin-grid">
      <form className="admin-form glass" onSubmit={onSubmit}>
        <h2>{form._id ? 'Edit experience' : 'Add new experience'}</h2>

        <div className="admin-row">
          <label className="admin-field">
            <span>Role *</span>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          </label>
          <label className="admin-field">
            <span>Company *</span>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          </label>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Location</span>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>
          <label className="admin-field">
            <span>Period *</span>
            <input
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              placeholder="Jun 2024 - Jul 2024"
              required
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>

        <label className="admin-field">
          <span>Achievements (one per line)</span>
          <textarea
            rows={4}
            value={form.achievements}
            onChange={(e) => setForm({ ...form, achievements: e.target.value })}
          />
        </label>

        <label className="admin-field">
          <span>Technologies (comma separated)</span>
          <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
        </label>

        <div className="admin-field">
          <span>Company logo</span>
          <ImageUpload
            value={form.image}
            currentImageUrl={form.currentImage}
            onChange={(file) => setForm({ ...form, image: file })}
          />
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {form._id ? <FiSave /> : <FiPlus />}
            {saving ? 'Saving…' : form._id ? 'Save changes' : 'Add experience'}
          </button>
          {form._id && (
            <button type="button" className="btn btn-secondary" onClick={() => setForm(EMPTY)}>
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        <div className="admin-list-header">
          <h2>Existing Experiences {loading ? '…' : `(${items.length})`}</h2>
          <button
            type="button"
            className="icon-btn refresh-btn"
            onClick={refresh}
            disabled={loading}
            title="Refresh experience"
            aria-label="Refresh experience"
          >
            <FiRefreshCw className={loading ? 'spin' : ''} />
          </button>
        </div>
        {!loading && items.length === 0 && <p className="admin-muted">No experience entries yet.</p>}
        {items.map((e) => (
          <article key={e._id} className="admin-list-item">
            <div className="admin-list-thumb">
              {e.logo ? <img src={e.logo} alt="" /> : <span>💼</span>}
            </div>
            <div className="admin-list-body">
              <h3>{e.role}</h3>
              <p>{e.company} · {e.period}</p>
              <div className="admin-list-meta">
                {e.location && <span>{e.location}</span>}
              </div>
            </div>
            <div className="admin-list-actions">
              <button className="icon-btn" onClick={() => startEdit(e)} aria-label="Edit"><FiEdit2 /></button>
              <button className="icon-btn danger" onClick={() => onDelete(e._id)} aria-label="Delete"><FiTrash2 /></button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ExperiencePanel;
