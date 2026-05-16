import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiClock, FiExternalLink, FiFileText } from 'react-icons/fi';
import { listBlogs } from '../../services/blogsService';
import './Blogs.css';

// Blog cards intentionally mirror the Project card structure (image area,
// header with icon + meta, title, excerpt, tags) so the homepage looks
// uniform. The whole <a> is the click target — no "View Details" button.
const Blogs = ({ preview = true }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('all');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = preview ? { limit: 3 } : {};
    listBlogs(params)
      .then((data) => !cancelled && setBlogs(data || []))
      .catch(() => !cancelled && setBlogs([]))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [preview]);

  const tagsFromData = Array.from(new Set(blogs.flatMap((b) => b.tags || [])));
  const tags = [{ key: 'all', label: 'All' }, ...tagsFromData.map((t) => ({ key: t, label: t }))];

  const visibleBlogs = activeTag === 'all'
    ? blogs
    : blogs.filter((b) => (b.tags || []).includes(activeTag));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="blogs" id="blogs" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Writing</span>
          <h2 className="section-title">
            {preview ? 'Latest Blogs' : 'All Blogs'}
          </h2>
          <p className="section-description">
            Articles I've written about the things I learn while building software
          </p>
        </motion.div>

        {!preview && tags.length > 1 && (
          <motion.div
            className="blogs-filter"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tags.map((t) => (
              <button
                key={t.key}
                className={`filter-btn ${activeTag === t.key ? 'active' : ''}`}
                onClick={() => setActiveTag(t.key)}
              >
                {t.label}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div className="blogs-loading">
            <div className="loading-spinner" />
          </div>
        ) : visibleBlogs.length === 0 ? (
          <div className="blogs-empty">
            <p>No blogs yet — I'll post the first one soon.</p>
          </div>
        ) : (
          <motion.div
            className="blogs-grid"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {visibleBlogs.map((blog) => (
              <motion.a
                key={blog._id}
                href={blog.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-card"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="blog-image">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} className="blog-img" />
                  ) : (
                    <span className="blog-emoji">📝</span>
                  )}
                </div>

                <div className="blog-content">
                  <div className="blog-header">
                    <FiFileText className="blog-icon" />
                    <div className="blog-links">
                      <span className="blog-readtime">
                        <FiClock /> {blog.readTime || '5 min read'}
                      </span>
                      <FiExternalLink className="blog-external" />
                    </div>
                  </div>

                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-description">{blog.excerpt}</p>

                  <div className="blog-tech">
                    {(blog.tags || []).slice(0, 4).map((tag, i) => (
                      <span key={i} className="tech-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        {preview && blogs.length > 0 && (
          <motion.div
            className="blogs-more"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <Link to="/blogs" className="btn btn-primary">
              View All Blogs <FiArrowRight />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
