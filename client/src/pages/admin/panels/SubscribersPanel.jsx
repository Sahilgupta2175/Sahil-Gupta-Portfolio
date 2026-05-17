import React, { useEffect, useState } from 'react';
import { FiTrash2, FiDownload, FiMail, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { listSubscribers, deleteSubscriber } from '../../../services/subscribersService';

// Read-only-ish panel: admin can see everyone on the list, sort active vs.
// unsubscribed, and remove rows. Creation happens via the public footer
// form — not from the dashboard.
const SubscribersPanel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  const refresh = () => {
    setLoading(true);
    listSubscribers()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Permanently delete this subscriber? They will receive no future emails.')) return;
    await deleteSubscriber(id);
    refresh();
  };

  // Quick CSV download — useful if you ever want to switch providers or
  // import the list elsewhere.
  const exportCsv = () => {
    const rows = [['email', 'active', 'subscribed_at', 'unsubscribed_at', 'source']];
    items.forEach((s) => {
      rows.push([
        s.email,
        s.active ? 'true' : 'false',
        new Date(s.createdAt).toISOString(),
        s.unsubscribedAt ? new Date(s.unsubscribedAt).toISOString() : '',
        s.source || ''
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visible = items.filter((s) => {
    if (filter === 'active') return s.active;
    if (filter === 'inactive') return !s.active;
    return true;
  });

  const activeCount = items.filter((s) => s.active).length;
  const inactiveCount = items.length - activeCount;

  return (
    <div>
      <div className="subscribers-toolbar">
        <div className="subscribers-stats">
          <div className="sub-stat">
            <span className="sub-stat-label">Total</span>
            <span className="sub-stat-value">{items.length}</span>
          </div>
          <div className="sub-stat">
            <span className="sub-stat-label">Active</span>
            <span className="sub-stat-value success">{activeCount}</span>
          </div>
          <div className="sub-stat">
            <span className="sub-stat-label">Unsubscribed</span>
            <span className="sub-stat-value muted">{inactiveCount}</span>
          </div>
        </div>

        <div className="subscribers-actions">
          <div className="admin-tabs sub-filter">
            {['active', 'inactive', 'all'].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`admin-tab ${filter === key ? 'active' : ''}`}
              >
                {key[0].toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="btn btn-secondary btn-small"
            onClick={exportCsv}
            disabled={items.length === 0}
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      <p className="admin-muted subscribers-blurb">
        New blog posts and projects automatically email everyone in the <strong>Active</strong> list.
        Subscribers can opt out via the link in every email — those move to <strong>Unsubscribed</strong> and stop receiving blasts.
      </p>

      <div className="subscribers-list">
        {loading && <p className="admin-muted">Loading…</p>}
        {!loading && visible.length === 0 && (
          <p className="admin-muted">No subscribers in this view.</p>
        )}
        {visible.map((s) => (
          <article key={s._id} className="admin-list-item sub-item">
            <div className="admin-list-thumb">
              <FiMail style={{ fontSize: 22 }} />
            </div>
            <div className="admin-list-body">
              <h3 className="sub-email">{s.email}</h3>
              <div className="admin-list-meta">
                {s.active ? (
                  <span className="sub-badge success"><FiCheckCircle /> Active</span>
                ) : (
                  <span className="sub-badge muted"><FiXCircle /> Unsubscribed</span>
                )}
                <span>Joined {new Date(s.createdAt).toLocaleDateString()}</span>
                {!s.active && s.unsubscribedAt && (
                  <span>Left {new Date(s.unsubscribedAt).toLocaleDateString()}</span>
                )}
                {s.source && <span>via {s.source}</span>}
              </div>
            </div>
            <div className="admin-list-actions">
              <button
                className="icon-btn danger"
                onClick={() => onDelete(s._id)}
                aria-label="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SubscribersPanel;
