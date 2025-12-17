import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-scroll';
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  const socialLinks = [
    { icon: <FiGithub />, url: 'https://github.com/Sahilgupta2175', label: 'GitHub' },
    { icon: <FiLinkedin />, url: 'https://linkedin.com/in/sahilgupta2175', label: 'LinkedIn' },
    { icon: <FiMail />, url: 'mailto:guptasahil2175@gmail.com', label: 'Email' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
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
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="hero" id="hero">
      {/* Animated Background Elements */}
      <div className="hero-bg">
        <motion.div 
          className="hero-orb hero-orb-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="hero-orb hero-orb-2"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="hero-orb hero-orb-3"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Grid Pattern */}
        <div className="hero-grid" />
      </div>

      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Social Links - Left Side */}
          <motion.div className="hero-socials" variants={itemVariants}>
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={social.label}
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                {social.icon}
              </motion.a>
            ))}
            <div className="social-line" />
          </motion.div>

          {/* Main Content */}
          <div className="hero-main">
            <motion.div className="hero-badge" variants={itemVariants}>
              <span className="badge-dot" />
              <span>Available for new opportunities</span>
            </motion.div>

            <motion.p className="hero-greeting" variants={itemVariants}>
              Hello, I'm
            </motion.p>

            <motion.h1 className="hero-name" variants={itemVariants}>
              Sahil Gupta
              <motion.span 
                className="hero-emoji"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                👋
              </motion.span>
            </motion.h1>

            <motion.div className="hero-title-wrapper" variants={itemVariants}>
              <span className="hero-title-prefix">I'm a </span>
              <TypeAnimation
                sequence={[
                  'Problem Solver',
                  2000,
                  'MERN Developer',
                  2000,
                  'CS Student',
                  2000
                ]}
                wrapper="span"
                speed={50}
                className="hero-title-animated"
                repeat={Infinity}
              />
            </motion.div>

            <motion.p className="hero-description" variants={itemVariants}>
              I create scalable web applications using modern technologies. 
              Passionate about clean code, user experience, and solving 
              complex problems through innovative solutions.
            </motion.p>

            <motion.div className="hero-cta" variants={itemVariants}>
              <Link to="projects" smooth={true} duration={500} offset={-80}>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View My Work</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
              </Link>
              <Link to="contact" smooth={true} duration={500} offset={-80}>
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Let's Talk
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div className="hero-stats" variants={itemVariants}>
              <div className="stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">Problems Solved</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">7.46</span>
                <span className="stat-label">CGPA</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">85%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual - Right Side */}
          <motion.div 
            className="hero-visual"
            variants={floatingVariants}
            animate="animate"
          >
            <div className="hero-image-wrapper">
              <div className="hero-image-bg" />
              <div className="hero-image">
                <img 
                  src="/Sahil_Photo.jpg" 
                  alt="Sahil Gupta" 
                  className="hero-avatar-img"
                />
              </div>
              <div className="hero-image-ring" />
              <div className="hero-image-ring hero-image-ring-2" />
              
              {/* Floating Tech Icons */}
              <motion.div 
                className="floating-icon floating-icon-1"
                animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ⚛️
              </motion.div>
              <motion.div 
                className="floating-icon floating-icon-2"
                animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🚀
              </motion.div>
              <motion.div 
                className="floating-icon floating-icon-3"
                animate={{ y: [-3, 3, -3], rotate: [0, 15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                💡
              </motion.div>
            </div>
          </motion.div>

          {/* Email - Right Side */}
          <motion.div className="hero-email" variants={itemVariants}>
            <a href="mailto:guptasahil2175@gmail.com" className="email-link">
              guptasahil2175@gmail.com
            </a>
            <div className="email-line" />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Link to="about" smooth={true} duration={500} offset={-80}>
            <motion.div
              className="scroll-icon"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FiArrowDown />
            </motion.div>
            <span>Scroll Down</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
