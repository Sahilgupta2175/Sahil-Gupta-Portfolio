import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiSave, FiX, FiRefreshCw, FiSend } from 'react-icons/fi';
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  notifyBlogSubscribers
} from '../../../services/blogsService';
import ImageUpload from '../widgets/ImageUpload';
import { toArr, fromArr } from './helpers';
import FormSheet from '../widgets/FormSheet';

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
  const [open, setOpen] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [notice, setNotice] = useState('');

  const refresh = () => {
    setLoading(true);
    listBlogs()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  // AdminDashboard remounts this panel (key changes) when Refresh is pressed.
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
    setError('');
    setOpen(true);
  };

  const openNew = () => {
    setForm(EMPTY);
    setError('');
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setForm(EMPTY);
    setError('');
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
      close();
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onNotify = async (b) => {
    const again = b.notifiedAt
      ? `Subscribers were already emailed about this on ${new Date(b.notifiedAt).toLocaleDateString()}. Send again?`
      : `Email "${b.title}" to every active subscriber now?`;
    if (!window.confirm(again)) return;
    setSendingId(b._id);
    setNotice('');
    try {
      const r = await notifyBlogSubscribers(b._id);
      setNotice(`Sent "${r.title}" to ${r.ok} of ${r.total} subscriber(s)${r.failed ? `, ${r.failed} failed` : ''}.`);
      refresh();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Sending failed.');
    } finally {
      setSendingId(null);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this blog? This also removes its cover image from Cloudinary.')) return;
    await deleteBlog(id);
    refresh();
  };

  return (
    <div className="admin-stack">
      <FormSheet open={open} onClose={close} title={form._id ? 'Edit blog' : 'Add new blog'}>
        <form className="admin-form" onSubmit={onSubmit}>
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
            <button type="button" className="btn btn-secondary" onClick={close}>
              <FiX /> Cancel
            </button>
          </div>
        </form>
      </FormSheet>

      <div className="admin-list">
        <div className="admin-list-header">
          <h2>Existing Blogs {loading ? '…' : `(${items.length})`}</h2>
          <div className="admin-list-tools">
            <button type="button" className="btn btn-primary btn-small" onClick={openNew}>
              <FiPlus aria-hidden="true" /> Add blog
            </button>
            <button
              type="button"
              className="icon-btn refresh-btn"
              onClick={refresh}
              disabled={loading}
              title="Refresh blogs"
              aria-label="Refresh blogs"
            >
              <FiRefreshCw className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>
        {notice && <p className="admin-muted" role="status">{notice}</p>}
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
                <span>{b.notifiedAt ? `Emailed ${new Date(b.notifiedAt).toLocaleDateString()}` : 'Not emailed'}</span>
              </div>
            </div>
            <div className="admin-list-actions">
              <button
                className="icon-btn"
                onClick={() => onNotify(b)}
                disabled={sendingId !== null || !b.published}
                aria-label="Email subscribers"
                title="Email this post to subscribers"
              >
                <FiSend className={sendingId === b._id ? 'spin' : ''} />
              </button>
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
