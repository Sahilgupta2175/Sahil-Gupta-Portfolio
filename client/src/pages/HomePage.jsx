import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SiteShell from '../components/SiteShell/SiteShell';
import Hero from '../components/Hero/Hero';
import Bento from '../components/Bento/Bento';
import Projects from '../components/Projects/Projects';
import About from '../components/About/About';
import Experience from '../components/Experience/Experience';
import Blogs from '../components/Blogs/Blogs';
import FAQ from '../components/FAQ/FAQ';
import Contact from '../components/Contact/Contact';

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
    <SiteShell>
      <Hero />
      <Bento />
      <Projects />
      <About />
      <Experience />
      <Blogs />
      <FAQ />
      <Contact />
    </SiteShell>
  );
};

export default HomePage;
