import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { listBlogs } from '../../services/blogsService';
import { subscribe } from '../../services/subscribersService';
import './Blogs.css';

const HOME_LIMIT = 4;
const PHONE = '(max-width: 600px)';

// Phones show the subscribe card under "Read all blogs"; wider screens keep
// it inside the post grid.
const useIsPhone = () => {
  const [isPhone, setIsPhone] = useState(() => window.matchMedia(PHONE).matches);
  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const onChange = (e) => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isPhone;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const SubscribeTile = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setMessage('');
    try {
      const res = await subscribe(email);
      setStatus('success');
      setMessage(res.message || 'Subscribed. See you in your inbox.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <form className="wsub" onSubmit={onSubmit}>
      <label htmlFor="subscribe-email" className="wsub-title">New post? Get it in your inbox.</label>
      <div className="wsub-row">
        <input
          id="subscribe-email"
          type="email"
          required
          placeholder="you@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting'}
        />
        <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      <p className={`wsub-msg ${status}`} role="status" aria-live="polite">{message}</p>
    </form>
  );
};

const Blogs = ({ preview = true }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState('all');
  const isPhone = useIsPhone();

  useEffect(() => {
    let cancelled = false;
    listBlogs(preview ? { limit: HOME_LIMIT } : {})
      .then((data) => !cancelled && setBlogs(data || []))
      .catch(() => !cancelled && setBlogs([]))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [preview]);

  // Tag filter on the full page: the 8 most used tags keep the bar short.
  const tagCounts = blogs.flatMap((b) => b.tags || []).reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map());
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
  const visible = tag === 'all' ? blogs : blogs.filter((b) => (b.tags || []).includes(tag));

  return (
    <section className="writing" id="blogs" aria-labelledby="writing-title">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h2 id="writing-title" className="display-title">{preview ? 'Writing' : 'All writing'}</h2>
          {preview ? (
            <span className="writing-note">Notes on building, synced from Hashnode</span>
          ) : (
            topTags.length > 1 && (
              <div className="seg seg-chips" role="tablist" aria-label="Filter posts by tag">
                {['all', ...topTags].map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tag === t}
                    className={`seg-btn ${tag === t ? 'active' : ''}`}
                    onClick={() => setTag(t)}
                  >
                    {t === 'all' ? 'All' : t}
                  </button>
                ))}
              </div>
            )
          )}
        </motion.div>

        {loading ? (
          <div className="loading-spinner" role="status" aria-label="Loading posts" />
        ) : (
          <div className={`wgrid ${preview ? 'is-preview' : ''}`}>
            {visible.length === 0 && <p className="writing-empty">No posts yet. The first one is on its way.</p>}
            {visible.map((b, i) => (
              <motion.a
                key={b._id}
                href={b.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`wcard ${preview && i === 0 ? 'wbig' : ''}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="wcover">
                  {b.coverImage ? (
                    <img src={b.coverImage} alt="" loading="lazy" />
                  ) : (
                    <span className="wcover-gen" aria-hidden="true">{b.title.split(' ').slice(0, 2).join(' ')}</span>
                  )}
                </div>
                <div className="wbody">
                  <div className="wtags">
                    {(b.tags || []).slice(0, 3).map((t) => <span key={t}>#{t}</span>)}
                  </div>
                  <h3>{b.title}</h3>
                  <p>{b.excerpt}</p>
                  <span className="wmeta">
                    <span>{fmtDate(b.createdAt)} · {b.readTime || '5 min read'}</span>
                    <FiArrowUpRight className="warrow" aria-hidden="true" />
                  </span>
                </div>
              </motion.a>
            ))}
            {preview && !isPhone && <SubscribeTile />}
          </div>
        )}

        {preview && blogs.length > 0 && (
          <div className="writing-more">
            <Link to="/blogs" className="btn btn-secondary">
              Read all blogs <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        )}

        {preview && isPhone && <SubscribeTile />}
      </div>
    </section>
  );
};

export default Blogs;
