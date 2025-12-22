import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink, FiFolder, FiX } from 'react-icons/fi';
import './Projects.css';

const projectsData = [
  {
    id: 1,
    title: 'Vehicle Rental Services Platform',
    description: 'A comprehensive full-stack vehicle rental management system with multi-role authentication, real-time notifications, AI-powered chatbot, and integrated payment gateway for seamless rental operations.',
    longDescription: 'Vehicle Rental Services is a secure, enterprise-grade web platform for managing end-to-end vehicle rental operations. It offers role-based dashboards for Users, Vendors, and Admins, enabling seamless vehicle booking with real-time availability, fleet and earnings management, and system-wide analytics. The platform includes JWT authentication with email verification, Razorpay payments, an AI-powered chatbot, real-time notifications, SMS and email alerts, and advanced booking management with reports and exports. Enhanced security, responsive design, automated processes, and comprehensive transaction and refund tracking ensure a reliable and scalable rental solution.',
    image: '🚗',
    technologies: ['React 19.2.0', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'TailwindCSS', 'Vite', 'Socket.IO', 'JWT', 'Razorpay', 'Google Gemini AI', 'Cloudinary', 'Twilio', 'SendGrid', 'Nodemailer', 'React Router DOM', 'Zustand', 'React Hook Form', 'Axios', 'React Datepicker', 'React Toastify', 'Bcrypt.js', 'Helmet', 'Express Validator', 'Multer', 'PDFKit', 'CSV Writer', 'Node Cron', 'Morgan', 'Pino' ],
    category: 'web',
    liveUrl: 'https://vrs-frontend-sg.vercel.app',
    githubUrl: 'https://github.com/Sahilgupta2175/vehicle-rental-services',
    featured: true
  },
  {
    id: 2,
    title: 'Zerodha - Stock Trading Platform',
    description: 'Full-stack stock trading platform replicating Zerodha\'s functionality with real-time portfolio management, order execution, and user authentication.',
    longDescription: 'Full-stack stock trading platform replicating Zerodha\'s functionality with real-time portfolio management, order execution, and user authentication. Features comprehensive dashboard for tracking holdings, positions, and market data with seamless buy/sell operations. Secure user authentication system with JWT tokens and cookie-based sessions.',
    image: '📈',
    technologies: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Axios'],
    category: 'web',
    liveUrl: 'https://zerodha-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Zerodha-project',
    featured: true
  },
  {
    id: 3,
    title: 'Wanderlust - Property Rental Platform',
    description: 'A full-stack property rental web application inspired by Airbnb with comprehensive property management and interactive maps.',
    longDescription: 'A full-stack property rental web application inspired by Airbnb, built with Node.js and Express.js. Features comprehensive property management, real-time search functionality, interactive maps with Mapbox, secure user authentication with Passport.js, and cloud-based image storage with Cloudinary. Implements MVC architecture with MongoDB.',
    image: '🏠',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Passport.js', 'Mapbox', 'Cloudinary'],
    category: 'web',
    liveUrl: 'https://wanderlust-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Wanderlust',
    featured: true
  },
  {
    id: 4,
    title: 'InShare - File Sharing Application',
    description: 'A secure file sharing web application that allows users to upload, share, and download files with temporary links.',
    longDescription: 'A secure file sharing web application that allows users to upload, share, and download files with temporary links. Built with Node.js and Express, featuring real-time file management, UUID-based encrypted link generation with temporary storage, and files auto-delete after 24 hours or first download.',
    image: '📁',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Multer', 'UUID', 'Crypto'],
    category: 'web',
    liveUrl: 'https://inshare-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/inshare-project',
    featured: true
  },
  {
    id: 5,
    title: 'Netflix UI Clone',
    description: 'A pixel-perfect recreation of Netflix\'s homepage with dynamic content loading using TMDB API.',
    longDescription: 'A pixel-perfect recreation of Netflix\'s homepage with dynamic content loading. Features responsive design and smooth animations for an authentic user experience. Dynamic content loading using The Movie Database (TMDB) API with 95% visual accuracy.',
    image: '🎬',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'TMDB API'],
    category: 'web',
    liveUrl: 'https://netflix-clone-ft.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Hunar-intern-project/tree/main/Netflix%20clone',
    featured: false
  }
];

const categories = [
  { key: 'all', label: 'All Projects' },
  { key: 'web', label: 'Web Apps' },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const filteredProjects = activeCategory === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
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
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-description">
            A selection of projects I've worked on, showcasing my skills in design and development
          </p>
        </motion.div>

        {/* Category Filter */}
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

        {/* Projects Grid */}
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
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
                  <span className="project-emoji">{project.image}</span>
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
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <FiGithub />
                      </a>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <FiExternalLink />
                      </a>
                    </div>
                  </div>

                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-tech">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More Button */}
        <motion.div
          className="projects-more"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="https://github.com/Sahilgupta2175"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiGithub />
            View All Projects on GitHub
          </motion.a>
        </motion.div>
      </div>

      {/* Project Modal */}
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
                <span className="modal-emoji">{selectedProject.image}</span>
              </div>

              <div className="modal-content">
                <h2 className="modal-title">{selectedProject.title}</h2>
                <p className="modal-description">
                  {selectedProject.longDescription || selectedProject.description}
                </p>

                <div className="modal-tech">
                  {selectedProject.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="modal-actions">
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <FiExternalLink />
                    Live Demo
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <FiGithub />
                    Source Code
                  </a>
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
