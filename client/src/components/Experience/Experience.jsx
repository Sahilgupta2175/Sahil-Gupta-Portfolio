import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import './Experience.css';

const experienceData = [
  {
    id: 1,
    role: 'Trainee - Job Oriented Value Added Course',
    company: 'GLA University',
    location: 'Remote',
    period: 'Jun 2024 - Jul 2024',
    description: 'Intensive training program focused on practical industry skills and database management.',
    achievements: [
      'Gained hands-on experience with PostgreSQL through instructor-led sessions',
      'Achieved Top 3 Performer status among 50 interns in the summer cohort',
      'Developed practical skills in database design and SQL queries'
    ],
    technologies: ['PostgreSQL', 'SQL', 'Database Design']
  }
];

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
    cgpa: '84.2%',
    icon: '🏫'
  }
];

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
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
          {/* Timeline */}
          <motion.div
            className="experience-timeline"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {experienceData.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="timeline-item"
                variants={itemVariants}
              >
                <div className="timeline-marker">
                  <div className="marker-dot" />
                  <div className="marker-line" />
                </div>

                <motion.div
                  className="timeline-card"
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <div className="timeline-header">
                    <div className="timeline-icon">
                      <FiBriefcase />
                    </div>
                    <div className="timeline-meta">
                      <span className="timeline-period">
                        <FiCalendar /> {exp.period}
                      </span>
                      <span className="timeline-location">
                        <FiMapPin /> {exp.location}
                      </span>
                    </div>
                  </div>

                  <h3 className="timeline-role">{exp.role}</h3>
                  <h4 className="timeline-company">{exp.company}</h4>
                  <p className="timeline-description">{exp.description}</p>

                  <ul className="timeline-achievements">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>

                  <div className="timeline-tech">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Education Sidebar */}
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
