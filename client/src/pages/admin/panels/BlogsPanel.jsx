import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiSave, FiX } from 'react-icons/fi';
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from '../../../services/blogsService';
import ImageUpload from '../widgets/ImageUpload';

const toArr = (str) => (str || '').split(',').map((s) => s.trim()).filter(Boolean);
const fromArr = (arr) => (arr || []).join(', ');

const EMPTY = {
  _id: null,
  title: '',
  excerpt: '',
  tags: '',
  readTime: '5 min read',
  externalUrl: '',
  published: true,
  image: null,
  currentImage: ''
};

const BlogsPanel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = () => {
    setLoading(true);
    listBlogs()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const startEdit = (b) => {
    setForm({
      _id: b._id,
      title: b.title || '',
      excerpt: b.excerpt || '',
      tags: fromArr(b.tags),
      readTime: b.readTime || '5 min read',
      externalUrl: b.externalUrl || '',
      published: b.published !== false,
      image: null,
      currentImage: b.coverImage || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      tags: toArr(form.tags),
      readTime: form.readTime,
      externalUrl: form.externalUrl,
      published: form.published
    };
    if (form.image) payload.image = form.image;

    try {
      if (form._id) {
        await updateBlog(form._id, payload);
      } else {
        await createBlog(payload);
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
    if (!window.confirm('Delete this blog? This also removes its cover image from Cloudinary.')) return;
    await deleteBlog(id);
    refresh();
  };

  return (
    <div className="admin-grid">
      <form className="admin-form glass" onSubmit={onSubmit}>
        <h2>{form._id ? 'Edit blog' : 'Add new blog'}</h2>

        <label className="admin-field">
          <span>Title *</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>

        <label className="admin-field">
          <span>Excerpt *</span>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            required
          />
        </label>

        <label className="admin-field">
          <span>External URL * (where readers actually read the post)</span>
          <input
            type="url"
            value={form.externalUrl}
            onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
            placeholder="https://medium.com/..."
            required
          />
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>Tags (comma separated)</span>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </label>
          <label className="admin-field">
            <span>Read time</span>
            <input value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
          </label>
        </div>

        <label className="admin-field admin-checkbox">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          <span>Published (visible on the site)</span>
        </label>

        <div className="admin-field">
          <span>Cover image</span>
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
            {saving ? 'Saving…' : form._id ? 'Save changes' : 'Add blog'}
          </button>
          {form._id && (
            <button type="button" className="btn btn-secondary" onClick={() => setForm(EMPTY)}>
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        <h2>Existing blogs {loading ? '…' : `(${items.length})`}</h2>
        {!loading && items.length === 0 && <p className="admin-muted">No blogs yet.</p>}
        {items.map((b) => (
          <article key={b._id} className="admin-list-item">
            <div className="admin-list-thumb">
              {b.coverImage ? <img src={b.coverImage} alt="" /> : <span>📝</span>}
            </div>
            <div className="admin-list-body">
              <h3>{b.title}</h3>
              <p>{b.excerpt}</p>
              <div className="admin-list-meta">
                <span>{b.readTime}</span>
                {!b.published && <span className="admin-badge">Draft</span>}
              </div>
            </div>
            <div className="admin-list-actions">
              <button className="icon-btn" onClick={() => startEdit(b)} aria-label="Edit"><FiEdit2 /></button>
              <button className="icon-btn danger" onClick={() => onDelete(b._id)} aria-label="Delete"><FiTrash2 /></button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogsPanel;
