import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SiReact, SiNodedotjs, SiMongodb, SiExpress, SiJavascript,
  SiGit, SiMysql, SiPostman, SiVercel
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import './Skills.css';

// Official brand marks (Simple Icons) in official brand colours. Express and
// Vercel are black in their brand guidelines, so they get white here to stay
// visible on the dark theme. Java isn't in Simple Icons (Oracle trademark), so
// it comes from Font Awesome.
const techStack = [
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
  { name: 'Express', Icon: SiExpress, color: '#FFFFFF' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  { name: 'Java', Icon: FaJava, color: '#ED8B00' },
  { name: 'Git', Icon: SiGit, color: '#F05032' },
  { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
  { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
  { name: 'Vercel', Icon: SiVercel, color: '#FFFFFF' }
];

const skillsData = {
  frontend: {
    title: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'JavaScript', level: 88 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 92 },
      { name: 'Bootstrap', level: 85 },
      { name: 'EJS Templating', level: 80 }
    ]
  },
  backend: {
    title: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', level: 88 },
      { name: 'Express.js', level: 88 },
      { name: 'Java', level: 75 },
      { name: 'RESTful APIs', level: 85 },
      { name: 'SQL', level: 80 },
      { name: 'Passport.js', level: 78 }
    ]
  },
  database: {
    title: 'Database',
    icon: '🗄️',
    skills: [
      { name: 'MongoDB', level: 88 },
      { name: 'Mongoose', level: 85 },
      { name: 'MySQL', level: 78 },
      { name: 'PostgreSQL', level: 75 }
    ]
  },
  tools: {
    title: 'Tools & Others',
    icon: '🛠️',
    skills: [
      { name: 'Git', level: 88 },
      { name: 'GitHub', level: 90 },
      { name: 'Postman', level: 85 },
      { name: 'Vercel', level: 82 },
      { name: 'VS Code', level: 92 },
      { name: 'Cloudinary', level: 78 }
    ]
  }
};

const Skills = () => {
  const [activeTab, setActiveTab] = useState('frontend');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="skills-bg">
        <div className="skills-orb skills-orb-1" />
        <div className="skills-orb skills-orb-2" />
      </div>

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">My Expertise</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-description">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        {/* Skill Tabs */}
        <motion.div
          className="skills-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {Object.keys(skillsData).map((key) => (
            <button
              key={key}
              className={`skill-tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <span className="tab-icon">{skillsData[key].icon}</span>
              <span className="tab-text">{skillsData[key].title}</span>
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="skills-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
          >
            {skillsData[activeTab].skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="skill-card"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-progress-bg">
                  <motion.div
                    className="skill-progress"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Tech Stack Icons */}
        <motion.div
          className="tech-stack-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="tech-stack-title">Technologies I Work With</h3>
          <div className="tech-stack-grid">
            {techStack.map(({ name, Icon, color }, index) => (
              <motion.div
                key={name}
                className="tech-item"
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <span className="tech-item-icon" style={{ color }}>
                  <Icon aria-hidden="true" />
                </span>
                <span className="tech-item-name">{name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
