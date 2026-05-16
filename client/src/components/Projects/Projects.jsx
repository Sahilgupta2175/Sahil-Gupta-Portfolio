import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink, FiFolder, FiX, FiArrowRight } from 'react-icons/fi';
import { listProjects } from '../../services/projectsService';
import { fallbackProjects } from '../../data/fallback';
import './Projects.css';

// `preview` mode shows only 3 featured projects + a "View All" CTA.
// Without preview the component shows everything with the filter bar.
const Projects = ({ preview = true }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listProjects()
      .then((data) => {
        if (cancelled) return;
        // If the API returns nothing, fall back to the bundled defaults so
        // the section never looks empty on first deploy.
        setProjects(data && data.length ? data : fallbackProjects);
      })
      .catch(() => {
        if (!cancelled) setProjects(fallbackProjects);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const categoriesFromData = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean))
  );
  const categories = [
    { key: 'all', label: 'All Projects' },
    ...categoriesFromData.map((c) => ({ key: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
  ];

  let visibleProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  // Homepage shows top 3 featured (falls back to first 3 if not enough featured).
  if (preview) {
    const featured = visibleProjects.filter((p) => p.featured);
    visibleProjects = (featured.length >= 3 ? featured : visibleProjects).slice(0, 3);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const renderImage = (project) => {
    if (project.image) {
      return <img src={project.image} alt={project.title} className="project-img" />;
    }
    return <span className="project-emoji">{project.emoji || '💼'}</span>;
  };

  return (
    <section className="projects" id="projects" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Portfolio</span>
          <h2 className="section-title">
            {preview ? 'Featured Projects' : 'All Projects'}
          </h2>
          <p className="section-description">
            A selection of projects I've worked on, showcasing my skills in design and development
          </p>
        </motion.div>

        {!preview && (
          <motion.div
            className="projects-filter"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div className="projects-loading">
            <div className="loading-spinner" />
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="projects-empty">
            <p>No projects yet — check back soon.</p>
          </div>
        ) : (
          <motion.div
            className="projects-grid"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <AnimatePresence mode="wait">
              {visibleProjects.map((project) => (
                <motion.div
                  key={project._id || project.id}
                  className={`project-card ${project.featured ? 'featured' : ''}`}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-image">
                    {renderImage(project)}
                    <div className="project-overlay">
                      <motion.button
                        className="overlay-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>

                  <div className="project-content">
                    <div className="project-header">
                      <FiFolder className="project-icon" />
                      <div className="project-links">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <FiGithub />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <FiExternalLink />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>

                    <div className="project-tech">
                      {(project.technologies || []).slice(0, 4).map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          className="projects-more"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          {preview ? (
            <Link to="/projects" className="btn btn-primary">
              View All Projects <FiArrowRight />
            </Link>
          ) : (
            <a
              href="https://github.com/Sahilgupta2175"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <FiGithub />
              View All Projects on GitHub
            </a>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="project-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedProject(null)}>
                <FiX />
              </button>

              <div className="modal-image">
                {selectedProject.image ? (
                  <img src={selectedProject.image} alt={selectedProject.title} className="modal-img" />
                ) : (
                  <span className="modal-emoji">{selectedProject.emoji || '💼'}</span>
                )}
              </div>

              <div className="modal-content">
                <h2 className="modal-title">{selectedProject.title}</h2>
                <p className="modal-description">
                  {selectedProject.longDescription || selectedProject.description}
                </p>

                <div className="modal-tech">
                  {(selectedProject.technologies || []).map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="modal-actions">
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <FiExternalLink />
                      Live Demo
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      <FiGithub />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
