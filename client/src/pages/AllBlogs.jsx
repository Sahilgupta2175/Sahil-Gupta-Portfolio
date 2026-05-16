import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Blogs from '../components/Blogs/Blogs';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import './PageShell.css';

const AllBlogs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app">
      <div className="animated-bg" />
      <div className="noise-overlay" />
      <Navbar />
      <main className="page-shell">
        <div className="container page-shell-back">
          <Link to="/" className="back-link">
            <FiArrowLeft /> Back to home
          </Link>
        </div>
        <Blogs preview={false} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AllBlogs;
