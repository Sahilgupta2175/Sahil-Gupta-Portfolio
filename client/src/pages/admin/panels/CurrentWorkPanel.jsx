import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit2, FiPlus, FiSave, FiX, FiRefreshCw } from 'react-icons/fi';
import {
  listAllCurrentWork,
  createCurrentWork,
  updateCurrentWork,
  deleteCurrentWork
} from '../../../services/currentWorkService';
import EmojiPicker from '../widgets/EmojiPicker';

// Pre-defined status options so the badge label stays consistent across cards.
// Free-form input is still allowed via the "Custom" field below.
const STATUS_PRESETS = ['Building', 'Learning', 'Researching', 'Designing', 'Planning', 'Shipping'];

const EMPTY = {
  _id: null,
  title: '',
  description: '',
  emoji: '🚀',
  status: 'Building',
  link: '',
  active: true
};

const CurrentWorkPanel = ({ refreshSignal = 0 }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = () => {
    setLoading(true);
    listAllCurrentWork()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  // Re-fetch on initial mount AND whenever the dashboard bumps refreshSignal.
  useEffect(() => { refresh(); }, [refreshSignal]);

  const startEdit = (item) => {
    setForm({
      _id: item._id,
      title: item.title || '',
      description: item.description || '',
      emoji: item.emoji || '🚀',
      status: item.status || 'Building',
      link: item.link || '',
      active: item.active !== false
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
      emoji: form.emoji,
      status: form.status,
      link: form.link,
      active: form.active
    };

    try {
      if (form._id) {
        await updateCurrentWork(form._id, payload);
      } else {
        await createCurrentWork(payload);
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
    if (!window.confirm('Delete this entry?')) return;
    await deleteCurrentWork(id);
    refresh();
  };

  return (
    <div className="admin-grid">
      <form className="admin-form glass" onSubmit={onSubmit}>
        <h2>{form._id ? 'Edit current work' : 'Add current work'}</h2>

        <label className="admin-field">
          <span>Title * (e.g. "Vehicle Rental v2.0")</span>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>

        <label className="admin-field">
          <span>Description * (one or two sentences about what you're doing)</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>Status badge</span>
            <select
              value={STATUS_PRESETS.includes(form.status) ? form.status : '__custom'}
              onChange={(e) => {
                if (e.target.value === '__custom') {
                  setForm({ ...form, status: '' });
                } else {
                  setForm({ ...form, status: e.target.value });
                }
              }}
            >
              {STATUS_PRESETS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="__custom">Custom…</option>
            </select>
          </label>

          {!STATUS_PRESETS.includes(form.status) && (
            <label className="admin-field">
              <span>Custom status label</span>
              <input
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                placeholder="e.g. Refactoring"
              />
            </label>
          )}
        </div>

        <label className="admin-field">
          <span>Link (optional — GitHub repo, live URL, etc.)</span>
          <input
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="https://github.com/..."
          />
        </label>

        <label className="admin-field admin-checkbox">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <span>Active (visible on the site)</span>
        </label>

        <div className="admin-field">
          <span>Icon</span>
          <EmojiPicker
            value={form.emoji}
            onChange={(emoji) => setForm({ ...form, emoji })}
          />
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {form._id ? <FiSave /> : <FiPlus />}
            {saving ? 'Saving…' : form._id ? 'Save changes' : 'Add entry'}
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
          <h2>Current Work {loading ? '…' : `(${items.length})`}</h2>
          <button
            type="button"
            className="icon-btn refresh-btn"
            onClick={refresh}
            disabled={loading}
            title="Refresh current work"
            aria-label="Refresh current work"
          >
            <FiRefreshCw className={loading ? 'spin' : ''} />
          </button>
        </div>
        {!loading && items.length === 0 && (
          <p className="admin-muted">
            Nothing yet — add what you're working on right now. The section won't
            appear on the site until you add at least one active entry.
          </p>
        )}
        {items.map((item) => (
          <article key={item._id} className="admin-list-item">
            <div className="admin-list-thumb">
              <span>{item.emoji || '🚀'}</span>
            </div>
            <div className="admin-list-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="admin-list-meta">
                <span>{item.status}</span>
                {!item.active && <span className="admin-badge">Hidden</span>}
              </div>
            </div>
            <div className="admin-list-actions">
              <button className="icon-btn" onClick={() => startEdit(item)} aria-label="Edit">
                <FiEdit2 />
              </button>
              <button className="icon-btn danger" onClick={() => onDelete(item._id)} aria-label="Delete">
                <FiTrash2 />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CurrentWorkPanel;
