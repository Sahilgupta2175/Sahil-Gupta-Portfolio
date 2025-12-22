import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FiGithub, FiLinkedin, FiMail} from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', to: 'hero' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Experience', to: 'experience' },
    { name: 'Contact', to: 'contact' }
  ];

  const socialLinks = [
    { icon: <FiGithub />, url: 'https://github.com/Sahilgupta2175', label: 'GitHub' },
    { icon: <FiLinkedin />, url: 'https://linkedin.com/in/sahilgupta2175', label: 'LinkedIn' },
    { icon: <FiMail />, url: 'mailto:guptasahil2175@gmail.com', label: 'Email' }
  ];

  return (
    <footer className="footer">
      <div className="footer-gradient" />
      
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="hero" smooth={true} duration={500} className="footer-logo">
              SG<span className="logo-dot">.</span>
            </Link>
            <p className="footer-tagline">
              Building digital experiences with passion and precision.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-nav">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    className="footer-nav-link"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4 className="footer-title">Contact</h4>
            <div className="footer-contact-list">
              <a href="mailto:guptasahil2175@gmail.com" className="footer-contact-item">
                guptasahil2175@gmail.com
              </a>
              <a href="tel:+919956564108" className="footer-contact-item">
                +91 9956564108
              </a>
              <span className="footer-contact-item">Orai, Uttar Pradesh, India</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4 className="footer-title">Stay Updated</h4>
            <p className="newsletter-text">
              Subscribe to get updates on my latest projects and blog posts.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <motion.button
                type="submit"
                className="newsletter-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Sahil Gupta.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
