import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiExternalLink } from 'react-icons/fi';
import { logout } from '../../services/authService';
import ProjectsPanel from './panels/ProjectsPanel';
import BlogsPanel from './panels/BlogsPanel';
import ExperiencePanel from './panels/ExperiencePanel';
import './Admin.css';

const TABS = [
  { key: 'projects', label: 'Projects' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'experience', label: 'Experience' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('projects');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="app">
      <div className="animated-bg" />
      <div className="noise-overlay" />
      <main className="admin">
        <div className="container">
          <header className="admin-header">
            <div>
              <h1 className="admin-title gradient-text">Admin Dashboard</h1>
              <p className="admin-sub">
                Add or edit content — changes appear on the site immediately.{' '}
                <Link to="/" className="admin-inline-link">
                  View site <FiExternalLink />
                </Link>
              </p>
            </div>
            <button className="btn btn-secondary" onClick={onLogout}>
              <FiLogOut /> Sign out
            </button>
          </header>

          <nav className="admin-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`admin-tab ${tab === t.key ? 'active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <section className="admin-panel">
            {tab === 'projects' && <ProjectsPanel />}
            {tab === 'blogs' && <BlogsPanel />}
            {tab === 'experience' && <ExperiencePanel />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
