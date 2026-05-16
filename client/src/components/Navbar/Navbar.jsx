import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import './Navbar.css';

// Each nav item targets a section id on the homepage. When the user is on
// /projects or /blogs we still want the same links to work — they navigate
// to "/" with a state hint and HomePage scrolls to the section on mount.
const navItems = [
  { name: 'Home', to: 'hero' },
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Projects', to: 'projects' },
  { name: 'Experience', to: 'experience' },
  { name: 'Blogs', to: 'blogs' },
  { name: 'Contact', to: 'contact' }
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Off-home navigation: jump to "/" and let HomePage scroll to the section.
  const goToSection = (sectionId) => {
    setIsOpen(false);
    navigate('/', { state: { scrollTo: sectionId } });
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: { opacity: 0, x: '100%', transition: { duration: 0.3, ease: 'easeInOut' } },
    open:   { opacity: 1, x: 0,      transition: { duration: 0.3, ease: 'easeInOut' } }
  };
  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.1, duration: 0.3 } })
  };

  // Renders a single nav-link. On the homepage it uses react-scroll for the
  // smooth in-page animation; on every other page it falls back to navigate().
  const renderDesktopLink = (item) => {
    const base = `nav-link ${activeSection === item.to ? 'active' : ''}`;
    if (onHome) {
      return (
        <ScrollLink
          to={item.to}
          spy
          smooth
          offset={-80}
          duration={500}
          className={base}
          onSetActive={() => setActiveSection(item.to)}
        >
          <span className="link-text">{item.name}</span>
          <span className="link-indicator" />
        </ScrollLink>
      );
    }
    return (
      <button type="button" className={base} onClick={() => goToSection(item.to)}>
        <span className="link-text">{item.name}</span>
        <span className="link-indicator" />
      </button>
    );
  };

  const renderMobileLink = (item, index) => {
    if (onHome) {
      return (
        <ScrollLink
          to={item.to}
          spy
          smooth
          offset={-80}
          duration={500}
          onClick={() => setIsOpen(false)}
          className="mobile-link"
        >
          <span className="link-number">0{index + 1}.</span>
          {item.name}
        </ScrollLink>
      );
    }
    return (
      <button type="button" className="mobile-link" onClick={() => goToSection(item.to)}>
        <span className="link-number">0{index + 1}.</span>
        {item.name}
      </button>
    );
  };

  // Logo always returns to the homepage hero.
  const Logo = () =>
    onHome ? (
      <ScrollLink to="hero" smooth duration={500} className="navbar-logo">
        <motion.span className="logo-text" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          SG<span className="logo-dot">.</span>
        </motion.span>
      </ScrollLink>
    ) : (
      <RouterLink to="/" className="navbar-logo">
        <motion.span className="logo-text" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          SG<span className="logo-dot">.</span>
        </motion.span>
      </RouterLink>
    );

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar-container">
        <Logo />

        <ul className="navbar-links">
          {navItems.map((item, index) => (
            <motion.li
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {renderDesktopLink(item)}
            </motion.li>
          ))}
        </ul>

        <motion.a
          href="/resume/Sahil_Gupta_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-resume-btn"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Resume
        </motion.a>

        <motion.button
          className="navbar-toggle"
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="navbar-mobile"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <ul className="mobile-links">
                {navItems.map((item, index) => (
                  <motion.li key={item.name} custom={index} variants={linkVariants}>
                    {renderMobileLink(item, index)}
                  </motion.li>
                ))}
              </ul>

              <motion.a
                href="/resume/Sahil_Gupta_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-resume-btn"
                variants={linkVariants}
                custom={navItems.length}
              >
                Resume
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
