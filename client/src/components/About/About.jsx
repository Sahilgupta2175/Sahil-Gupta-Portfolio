import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiDownload, FiMapPin, FiCalendar, FiCode, FiEye } from 'react-icons/fi';
import './About.css';

const About = () => {
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

  const highlights = [
    { icon: <FiMapPin />, label: 'Location', value: 'Orai, UP, India' },
    { icon: <FiCalendar />, label: 'Education', value: 'B.Tech CSE' },
    { icon: <FiCode />, label: 'Problems', value: '150+ Solved' }
  ];

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
                <span className="exp-number">150+</span>
                <span className="exp-text">Problems<br />Solved</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <div className="about-text-section">
            <motion.div className="section-header about-header" variants={itemVariants}>
              <span className="section-subtitle">About Me</span>
              <h2 className="section-title">Crafting Solutions<br />Through Code</h2>
            </motion.div>

            <motion.p className="about-description" variants={itemVariants}>
              I'm a passionate full-stack developer currently pursuing my Bachelor of 
              Technology in Computer Science (Honors) at GLA University, Mathura. With a 
              strong foundation in modern web technologies and a keen eye for user experience, 
              I love creating applications that solve real-world problems.
            </motion.p>

            <motion.p className="about-description" variants={itemVariants}>
              My journey in tech has been driven by curiosity and a constant desire to learn. 
              I've completed over 150 coding challenges on platforms like LeetCode and 
              HackerRank, maintaining an 85% success rate. This has helped me develop strong 
              problem-solving skills and a deep understanding of data structures and algorithms.
            </motion.p>

            {/* Highlights */}
            <motion.div className="about-highlights" variants={itemVariants}>
              {highlights.map((item, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">{item.icon}</div>
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

            {/* Tech Stack Preview */}
            <motion.div className="about-tech" variants={itemVariants}>
              <span className="tech-label">Tech I work with:</span>
              <div className="tech-icons">
                {['⚛️', '🟢', '🐍', '🔷', '🎨', '📱'].map((icon, i) => (
                  <motion.span
                    key={i}
                    className="tech-icon"
                    whileHover={{ scale: 1.2, y: -5 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    {icon}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
