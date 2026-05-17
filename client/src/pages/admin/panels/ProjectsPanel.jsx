import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiSave, FiX, FiRefreshCw } from 'react-icons/fi';
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject
} from '../../../services/projectsService';
import EmojiPicker from '../widgets/EmojiPicker';
import ImageUpload from '../widgets/ImageUpload';

// Local-only helper: convert a comma-separated string to a clean array of strings.
const toArr = (str) => (str || '').split(',').map((s) => s.trim()).filter(Boolean);
const fromArr = (arr) => (arr || []).join(', ');

const EMPTY = {
  _id: null,
  title: '',
  description: '',
  longDescription: '',
  technologies: '',
  emoji: '💻',
  liveUrl: '',
  githubUrl: '',
  category: 'web',
  featured: false,
  image: null,
  currentImage: ''
};

const ProjectsPanel = ({ refreshSignal = 0 }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = () => {
    setLoading(true);
    listProjects()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  // Re-fetch on initial mount AND whenever the dashboard bumps refreshSignal.
  useEffect(() => { refresh(); }, [refreshSignal]);

  const startEdit = (p) => {
    setForm({
      _id: p._id,
      title: p.title || '',
      description: p.description || '',
      longDescription: p.longDescription || '',
      technologies: fromArr(p.technologies),
      emoji: p.emoji || '💻',
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      category: p.category || 'web',
      featured: !!p.featured,
      image: null,
      currentImage: p.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      longDescription: form.longDescription,
      technologies: toArr(form.technologies),
      emoji: form.emoji,
      liveUrl: form.liveUrl,
      githubUrl: form.githubUrl,
      category: form.category,
      featured: form.featured
    };
    if (form.image) payload.image = form.image;

    try {
      if (form._id) {
        await updateProject(form._id, payload);
      } else {
        await createProject(payload);
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
    if (!window.confirm('Delete this project? This also removes its image from Cloudinary.')) return;
    await deleteProject(id);
    refresh();
  };

  return (
    <div className="admin-grid">
      <form className="admin-form glass" onSubmit={onSubmit}>
        <h2>{form._id ? 'Edit project' : 'Add new project'}</h2>

        <label className="admin-field">
          <span>Title *</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>

        <label className="admin-field">
          <span>Short description *</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>

        <label className="admin-field">
          <span>Long description (modal)</span>
          <textarea
            rows={5}
            value={form.longDescription}
            onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
          />
        </label>

        <label className="admin-field">
          <span>Technologies (comma separated)</span>
          <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
        </label>

        <label className="admin-field">
          <span>Category</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>Live URL</span>
            <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
          </label>
          <label className="admin-field">
            <span>GitHub URL</span>
            <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          </label>
        </div>

        <label className="admin-field admin-checkbox">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          <span>Featured (shown on homepage)</span>
        </label>

        <div className="admin-field">
          <span>Fallback icon (shown when there's no cover image)</span>
          <EmojiPicker
            value={form.emoji}
            onChange={(emoji) => setForm({ ...form, emoji })}
          />
        </div>

        <div className="admin-field">
          <span>Cover image (replaces the icon)</span>
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
            {saving ? 'Saving…' : form._id ? 'Save changes' : 'Add project'}
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
          <h2>Existing Projects {loading ? '…' : `(${items.length})`}</h2>
          <button
            type="button"
            className="icon-btn refresh-btn"
            onClick={refresh}
            disabled={loading}
            title="Refresh projects"
            aria-label="Refresh projects"
          >
            <FiRefreshCw className={loading ? 'spin' : ''} />
          </button>
        </div>
        {!loading && items.length === 0 && <p className="admin-muted">No projects yet.</p>}
        {items.map((p) => (
          <article key={p._id} className="admin-list-item">
            <div className="admin-list-thumb">
              {p.image ? <img src={p.image} alt="" /> : <span>{p.emoji || '💼'}</span>}
            </div>
            <div className="admin-list-body">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="admin-list-meta">
                <span>{p.category}</span>
                {p.featured && <span className="admin-badge">Featured</span>}
              </div>
            </div>
            <div className="admin-list-actions">
              <button className="icon-btn" onClick={() => startEdit(p)} aria-label="Edit"><FiEdit2 /></button>
              <button className="icon-btn danger" onClick={() => onDelete(p._id)} aria-label="Delete"><FiTrash2 /></button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPanel;
