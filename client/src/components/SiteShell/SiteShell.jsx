import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import './SiteShell.css';

// Shared page chrome: skip link, reading-progress bar, film grain, nav, footer.
const SiteShell = ({ children, mainClassName = '' }) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <motion.div className="read-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="main-content" tabIndex={-1} className={mainClassName}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default SiteShell;
