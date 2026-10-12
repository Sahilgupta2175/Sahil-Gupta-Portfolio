import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import SiteShell from '../components/SiteShell/SiteShell';
import Projects from '../components/Projects/Projects';
import './PageShell.css';

const AllProjects = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SiteShell mainClassName="page-shell" title="Projects">
      <div className="container page-shell-back">
        <Link to="/" className="back-link">
          <FiArrowLeft aria-hidden="true" /> Back to home
        </Link>
      </div>
      <Projects preview={false} />
    </SiteShell>
  );
};

export default AllProjects;
