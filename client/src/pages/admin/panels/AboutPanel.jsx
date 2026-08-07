import React, { useEffect, useState } from 'react';
import { FiSave, FiRefreshCw, FiPlus, FiTrash2 } from 'react-icons/fi';
import { getAbout, updateAbout } from '../../../services/aboutService';
import { fallbackAbout } from '../../../data/fallback';

// Single document, so this panel is one form — no list, no create/delete.
// Paragraphs are one textarea split on blank lines, which is how they read.
const toParagraphs = (str) => (str || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
const fromParagraphs = (arr) => (arr || []).join('\n\n');

const EMPTY_HIGHLIGHT = { label: '', value: '' };

// Nothing saved yet -> prefill with the copy the site currently shows, so the
// first save can't blank the section out.
const toForm = (data) => {
  const src = data && data.paragraphs?.length ? data : fallbackAbout;
  return {
    title: src.title || '',
    paragraphs: fromParagraphs(src.paragraphs),
    highlights: src.highlights?.length ? src.highlights.map((h) => ({ ...h })) : [{ ...EMPTY_HIGHLIGHT }],
    badgeNumber: src.badgeNumber || '',
    badgeText: src.badgeText || ''
  };
};

const AboutPanel = () => {
  const [form, setForm] = useState(toForm(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const refresh = () => {
    setLoading(true);
    getAbout()
      .then((data) => setForm(toForm(data)))
      .catch(() => setForm(toForm(null)))
      .finally(() => setLoading(false));
  };

  // AdminDashboard remounts this panel (key changes) when Refresh is pressed.
  useEffect(() => { refresh(); }, []);

  const setHighlight = (index, patch) =>
    setForm((f) => ({
      ...f,
      highlights: f.highlights.map((h, i) => (i === index ? { ...h, ...patch } : h))
    }));

  const addHighlight = () =>
    setForm((f) => ({ ...f, highlights: [...f.highlights, { ...EMPTY_HIGHLIGHT }] }));

  const removeHighlight = (index) =>
    setForm((f) => ({ ...f, highlights: f.highlights.filter((_, i) => i !== index) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      const next = await updateAbout({
        title: form.title,
        paragraphs: toParagraphs(form.paragraphs),
        highlights: form.highlights.filter((h) => h.label || h.value),
        badgeNumber: form.badgeNumber,
        badgeText: form.badgeText
      });
      setForm(toForm(next));
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-grid admin-grid-single">
      <form className="admin-form glass" onSubmit={onSubmit}>
        <div className="admin-list-header">
          <h2>About section</h2>
          <button
            type="button"
            className="icon-btn refresh-btn"
            onClick={refresh}
            disabled={loading}
            title="Reload about content"
            aria-label="Reload about content"
          >
            <FiRefreshCw className={loading ? 'spin' : ''} />
          </button>
        </div>

        <label className="admin-field">
          <span>Heading (use a new line to split it across two lines)</span>
          <textarea
            rows={2}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={'Crafting Solutions\nThrough Code'}
          />
        </label>

        <label className="admin-field">
          <span>Paragraphs (leave a blank line between each)</span>
          <textarea
            rows={10}
            value={form.paragraphs}
            onChange={(e) => setForm({ ...form, paragraphs: e.target.value })}
          />
        </label>

        <div className="admin-field">
          <span>Highlights (the three stat rows under the text)</span>
          {form.highlights.map((h, i) => (
            <div key={i} className="admin-row admin-row-tight">
              <input
                value={h.label}
                onChange={(e) => setHighlight(i, { label: e.target.value })}
                placeholder="Label (e.g. Location)"
              />
              <input
                value={h.value}
                onChange={(e) => setHighlight(i, { value: e.target.value })}
                placeholder="Value (e.g. Orai, UP, India)"
              />
              <button
                type="button"
                className="icon-btn danger"
                onClick={() => removeHighlight(i)}
                aria-label={`Remove highlight ${i + 1}`}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-small" onClick={addHighlight}>
            <FiPlus /> Add highlight
          </button>
        </div>

        <div className="admin-row">
          <label className="admin-field">
            <span>Badge number</span>
            <input
              value={form.badgeNumber}
              onChange={(e) => setForm({ ...form, badgeNumber: e.target.value })}
              placeholder="150+"
            />
          </label>
          <label className="admin-field">
            <span>Badge text (new line splits it)</span>
            <textarea
              rows={2}
              value={form.badgeText}
              onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
              placeholder={'Problems\nSolved'}
            />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}
        {saved && !error && <p className="admin-muted">Saved — the site is updated.</p>}

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving || loading}>
            <FiSave /> {saving ? 'Saving…' : 'Save about section'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPanel;
