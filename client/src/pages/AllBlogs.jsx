import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import SiteShell from '../components/SiteShell/SiteShell';
import Blogs from '../components/Blogs/Blogs';
import './PageShell.css';

const AllBlogs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SiteShell mainClassName="page-shell" title="Writing">
      <div className="container page-shell-back">
        <Link to="/" className="back-link">
          <FiArrowLeft aria-hidden="true" /> Back to home
        </Link>
      </div>
      <Blogs preview={false} />
    </SiteShell>
  );
};

export default AllBlogs;
