import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowDown, FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { profile } from '../../data/profile';
import './Navbar.css';

// Each item targets a section id on the homepage. Off the homepage the same
// links navigate to "/" with a state hint and HomePage scrolls on mount.
const navItems = [
  { name: 'Work', to: 'projects' },
  { name: 'About', to: 'about' },
  { name: 'Journey', to: 'experience' },
  { name: 'Writing', to: 'blogs' },
  { name: 'FAQ', to: 'faq' },
  { name: 'Contact', to: 'contact' }
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const goToSection = (id) => {
    setOpen(false);
    navigate('/', { state: { scrollTo: id } });
  };

  const renderLink = (item, className) =>
    onHome ? (
      <ScrollLink
        to={item.to}
        href={`#${item.to}`}
        spy
        smooth
        offset={-70}
        duration={500}
        className={`${className} ${active === item.to ? 'active' : ''}`}
        onSetActive={() => setActive(item.to)}
        onClick={() => setOpen(false)}
      >
        {item.name}
      </ScrollLink>
    ) : (
      <button type="button" className={className} onClick={() => goToSection(item.to)}>
        {item.name}
      </button>
    );

  const logo = (
    <>
      <span className="nav-logo-mark" aria-hidden="true">S</span>
      sahil.gupta
    </>
  );

  // The sheet is a sibling of <header>, not a child: the header's
  // backdrop-filter makes it the containing block for position:fixed
  // children, which squeezed the sheet into the 69px bar (invisible menu).
  return (
    <>
      <header className="nav">
        <nav className="nav-inner" aria-label="Primary">
          {onHome ? (
            <ScrollLink to="hero" href="#hero" smooth duration={500} className="nav-logo">{logo}</ScrollLink>
          ) : (
            <RouterLink to="/" className="nav-logo">{logo}</RouterLink>
          )}
  
          <div className="nav-links">
            {navItems.map((item) => (
              <React.Fragment key={item.to}>{renderLink(item, 'nav-link')}</React.Fragment>
            ))}
          </div>
  
          <div className="nav-actions">
            <ThemeToggle />
            <a className="btn btn-solid nav-resume" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
              Résumé <FiArrowDown aria-hidden="true" />
            </a>
            <button
              type="button"
              className="nav-burger"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="nav-sheet"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-sheet"
            className="nav-sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                {renderLink(item, 'nav-sheet-link')}
              </motion.div>
            ))}
            <a className="btn btn-primary nav-sheet-resume" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
              Résumé (PDF)
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
