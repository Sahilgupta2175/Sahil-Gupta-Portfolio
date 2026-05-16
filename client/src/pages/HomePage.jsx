import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Experience from '../components/Experience/Experience';
import Blogs from '../components/Blogs/Blogs';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

// The homepage composes every section in the original scroll order.
// When the navbar sends us here from /projects or /blogs it passes
// `state.scrollTo`; we honor that with a short delay so the sections
// have rendered before we try to find them.
const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const t = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
  }, [location.state]);

  return (
    <div className="app">
      <div className="animated-bg" />
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Blogs />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default HomePage;
