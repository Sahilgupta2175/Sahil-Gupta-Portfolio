import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiDownload, FiMapPin, FiCalendar, FiCode, FiEye } from 'react-icons/fi';
import { getAbout } from '../../services/aboutService';
import { fallbackAbout } from '../../data/fallback';
import './About.css';

// Highlight icons are design, not content — the admin edits label/value only,
// so the icons are matched positionally to however many rows were saved.
const HIGHLIGHT_ICONS = [<FiMapPin />, <FiCalendar />, <FiCode />];

// Renders "\n" in admin-entered text as a line break.
const withBreaks = (text) =>
  String(text || '').split('\n').map((line, i, all) => (
    <React.Fragment key={i}>
      {line}
      {i < all.length - 1 && <br />}
    </React.Fragment>
  ));

const About = () => {
  const [about, setAbout] = useState(fallbackAbout);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    let cancelled = false;
    getAbout()
      // Keep the bundled copy when nothing has been saved yet.
      .then((data) => !cancelled && data && setAbout({ ...fallbackAbout, ...data }))
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const highlights = about.highlights?.length ? about.highlights : fallbackAbout.highlights;
  const paragraphs = about.paragraphs?.length ? about.paragraphs : fallbackAbout.paragraphs;

  return (
    <section className="about" id="about" ref={ref}>
      <div className="container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Left Side - Image */}
          <motion.div className="about-image-section" variants={itemVariants}>
            <div className="about-image-wrapper">
              <div className="about-image-bg" />
              <div className="about-image">
                <div className="about-avatar">👨‍💻</div>
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                className="about-float-card about-float-card-1"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="float-card-icon">🎨</div>
                <div className="float-card-text">
                  <span className="float-card-title">UI/UX Design</span>
                  <span className="float-card-subtitle">Creative Solutions</span>
                </div>
              </motion.div>

              <motion.div 
                className="about-float-card about-float-card-2"
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="float-card-icon">⚡</div>
                <div className="float-card-text">
                  <span className="float-card-title">Fast Delivery</span>
                  <span className="float-card-subtitle">On-time every time</span>
                </div>
              </motion.div>

              {/* Experience Badge */}
              <div className="experience-badge">
                <span className="exp-number">{about.badgeNumber}</span>
                <span className="exp-text">{withBreaks(about.badgeText)}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <div className="about-text-section">
            <motion.div className="section-header about-header" variants={itemVariants}>
              <span className="section-subtitle">About Me</span>
              <h2 className="section-title">{withBreaks(about.title)}</h2>
            </motion.div>

            {paragraphs.map((text, index) => (
              <motion.p key={index} className="about-description" variants={itemVariants}>
                {text}
              </motion.p>
            ))}

            {/* Highlights */}
            <motion.div className="about-highlights" variants={itemVariants}>
              {highlights.map((item, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">{HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length]}</div>
                  <div className="highlight-content">
                    <span className="highlight-label">{item.label}</span>
                    <span className="highlight-value">{item.value}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div className="about-cta" variants={itemVariants}>
              <motion.a
                href="/resume/Sahil_Gupta_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEye />
                View Resume
              </motion.a>
              <motion.a
                href="/resume/Sahil_Gupta_Resume.pdf"
                download="Sahil_Gupta_Resume.pdf"
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDownload />
                Download Resume
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
