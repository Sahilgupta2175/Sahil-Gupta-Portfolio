import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity
} from 'framer-motion';
import { FiArrowRight, FiGithub, FiPlus } from 'react-icons/fi';
import { listProjects } from '../../services/projectsService';
import { fallbackProjects } from '../../data/fallback';
import './Projects.css';

const HOME_LIMIT = 6;
const LABELS = { web: 'Web', mobile: 'Mobile', design: 'Design', other: 'Other' };
const COVERS = ['cover-accent', 'cover-inverse', 'cover-plain'];

const hostOf = (p) => (p.liveUrl || p.githubUrl || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
const initials = (title) =>
  title.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// Admin-uploaded image if present, otherwise a generated typographic cover.
const Cover = ({ project, tone, className = '' }) => (
  <div className={`pcover ${tone} ${className}`}>
    {project.image ? (
      <img src={project.image} alt="" loading="lazy" />
    ) : (
      <div className="pcover-gen" aria-hidden="true">
        <span className="pcover-top">
          <span>{hostOf(project)}</span>
          {project.emoji && <span>{project.emoji}</span>}
        </span>
        <span className="pcover-mono">{initials(project.title)}</span>
      </div>
    )}
  </div>
);

const Projects = ({ preview = true }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [open, setOpen] = useState(null);
  const [hovered, setHovered] = useState(null);

  // Cursor-following preview, driven by motion values (no re-render per move).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });
  const rotate = useTransform(useVelocity(x), [-1500, 0, 1500], [-10, 0, 10], { clamp: true });

  useEffect(() => {
    let cancelled = false;
    listProjects()
      .then((data) => !cancelled && setProjects(data?.length ? data : fallbackProjects))
      .catch(() => !cancelled && setProjects(fallbackProjects))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const sorted = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const cats = Array.from(new Set(sorted.map((p) => p.category).filter(Boolean)));
  const filtered = category === 'all' ? sorted : sorted.filter((p) => p.category === category);
  const shown = preview ? filtered.slice(0, HOME_LIMIT) : filtered;
  const hoveredProject = shown.find((p) => p._id === hovered && p._id !== open);
  const hoveredIndex = shown.indexOf(hoveredProject);

  const onMove = (e) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <section className="projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h2 id="projects-title" className="display-title">
            {preview ? 'Selected work' : 'All projects'}<sup>({projects.length})</sup>
          </h2>
          {cats.length > 1 && (
            <div className="seg" role="tablist" aria-label="Filter projects by category">
              {['all', ...cats].map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={category === c}
                  className={`seg-btn ${category === c ? 'active' : ''}`}
                  onClick={() => { setCategory(c); setOpen(null); }}
                >
                  {c === 'all' ? 'All' : LABELS[c] || c}
                  <span className="count">
                    {c === 'all' ? projects.length : projects.filter((p) => p.category === c).length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="loading-spinner" role="status" aria-label="Loading projects" />
        ) : shown.length === 0 ? (
          <p className="projects-empty">Nothing in this category yet.</p>
        ) : (
          <div className="plist" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
            {shown.map((p, i) => {
              const isOpen = open === p._id;
              const panelId = `project-panel-${p._id}`;
              return (
                <motion.article
                  key={p._id}
                  className={`prow ${isOpen ? 'is-open' : ''}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: Math.min(i, 5) * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <button
                    type="button"
                    className="phead"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : p._id)}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(p._id)}
                  >
                    <span className="pnum">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pmain">
                      <span className="ptitle">{p.title}</span>
                      <span className="psub">{(p.technologies || []).slice(0, 4).join(' · ')}</span>
                    </span>
                    <span className="pcat">
                      {LABELS[p.category] || p.category}
                      {p.featured && <span className="pstar"> · Featured</span>}
                    </span>
                    <span className="pplus" aria-hidden="true"><FiPlus /></span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        className="ppanel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                      >
                        <div className="ppanel-inner">
                          <Cover project={p} tone={COVERS[i % COVERS.length]} className="ppanel-cover" />
                          <div className="ppanel-body">
                            <p>{p.longDescription || p.description}</p>
                            <div className="ptech">
                              {(p.technologies || []).map((t) => <span key={t} className="chip">{t}</span>)}
                            </div>
                            <div className="plinks">
                              {p.liveUrl && (
                                <a className="btn btn-solid" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                                  Open live site ↗
                                </a>
                              )}
                              {p.githubUrl && (
                                <a className="btn btn-secondary" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <FiGithub aria-hidden="true" /> Read the code
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="projects-more">
          {preview && projects.length > shown.length ? (
            <Link to="/projects" className="btn btn-secondary">
              View all {projects.length} projects <FiArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <a className="btn btn-secondary" href="https://github.com/Sahilgupta2175" target="_blank" rel="noopener noreferrer">
              <FiGithub aria-hidden="true" /> More on GitHub
            </a>
          )}
        </div>
      </div>

      <motion.div
        className="pfloat"
        aria-hidden="true"
        style={{ x, y, rotate }}
        initial={false}
        animate={{ opacity: hoveredProject ? 1 : 0, scale: hoveredProject ? 1 : 0.85 }}
        transition={{ duration: 0.25 }}
      >
        {hoveredProject && <Cover project={hoveredProject} tone={COVERS[hoveredIndex % COVERS.length]} />}
      </motion.div>
    </section>
  );
};

export default Projects;
