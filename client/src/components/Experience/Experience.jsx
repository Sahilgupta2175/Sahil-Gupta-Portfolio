import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import { listExperience } from '../../services/experienceService';
import { fallbackExperience } from '../../data/fallback';
import './Experience.css';

const educationData = [
  {
    degree: 'Bachelor of Technology',
    field: 'Computer Science (Honors)',
    institution: 'GLA University, Mathura',
    period: 'Expected Jun 2026',
    cgpa: 'CGPA: 7.46',
    icon: '🎓'
  },
  {
    degree: 'Senior Secondary Education',
    field: 'Science Stream',
    institution: 'Brij Kunwar Devi Aldrich Public School, Orai',
    period: 'May 2022',
    cgpa: 'Percentage: 84.2%',
    icon: '🏫'
  }
];

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    let cancelled = false;
    listExperience()
      .then((data) => {
        if (cancelled) return;
        setExperiences(data && data.length ? data : fallbackExperience);
      })
      .catch(() => !cancelled && setExperiences(fallbackExperience));
    return () => { cancelled = true; };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="experience" id="experience" ref={ref}>
      <div className="experience-bg">
        <div className="experience-line" />
      </div>

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Career Journey</span>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-description">
            My professional journey and the companies I've worked with
          </p>
        </motion.div>

        <div className="experience-content">
          <motion.div
            className="experience-timeline"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {experiences.map((exp) => (
              <motion.div
                key={exp._id || exp.id}
                className="timeline-item"
                variants={itemVariants}
              >
                <div className="timeline-marker">
                  <div className="marker-line" />
                </div>

                <motion.div
                  className="timeline-card"
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <div className="timeline-header">
                    <div className="timeline-icon">
                      {exp.logo ? (
                        <img src={exp.logo} alt={exp.company} className="timeline-logo" />
                      ) : (
                        <FiBriefcase />
                      )}
                    </div>
                    <div className="timeline-meta">
                      <span className="timeline-period">
                        <FiCalendar /> {exp.period}
                      </span>
                      {exp.location && (
                        <span className="timeline-location">
                          <FiMapPin /> {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="timeline-role">{exp.role}</h3>
                  <h4 className="timeline-company">{exp.company}</h4>
                  {exp.description && (
                    <p className="timeline-description">{exp.description}</p>
                  )}

                  {exp.achievements?.length > 0 && (
                    <ul className="timeline-achievements">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies?.length > 0 && (
                    <div className="timeline-tech">
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="experience-sidebar"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="sidebar-section">
              <h3 className="sidebar-title">Education</h3>
              {educationData.map((edu, index) => (
                <div key={index} className="education-card">
                  <div className="education-icon">{edu.icon}</div>
                  <div className="education-content">
                    <h4 className="education-degree">{edu.degree}</h4>
                    <p className="education-field">{edu.field}</p>
                    <p className="education-institution">{edu.institution}</p>
                    <span className="education-period">{edu.period}</span>
                    {edu.cgpa && <span className="education-cgpa">{edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Certifications</h3>
              <div className="certifications-list">
                {[
                  { name: 'LeetCode 150+ Problems', icon: '🏆' },
                  { name: 'HackerRank Certified', icon: '⭐' },
                  { name: 'PostgreSQL Training', icon: '🐘' }
                ].map((cert, i) => (
                  <div key={i} className="certification-item">
                    <span className="cert-icon">{cert.icon}</span>
                    <span className="cert-name">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Languages</h3>
              <div className="languages-list">
                {[
                  { name: 'English', level: 'Fluent' },
                  { name: 'Hindi', level: 'Native' }
                ].map((lang, i) => (
                  <div key={i} className="language-item">
                    <span className="lang-name">{lang.name}</span>
                    <span className="lang-level">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
