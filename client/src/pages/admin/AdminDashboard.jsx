import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import { logout } from '../../services/authService';
import ProjectsPanel from './panels/ProjectsPanel';
import BlogsPanel from './panels/BlogsPanel';
import ExperiencePanel from './panels/ExperiencePanel';
import CurrentWorkPanel from './panels/CurrentWorkPanel';
import SubscribersPanel from './panels/SubscribersPanel';
import './Admin.css';

const TABS = [
  { key: 'current', label: 'Current Work' },
  { key: 'projects', label: 'Projects' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'experience', label: 'Experience' },
  { key: 'subscribers', label: 'Subscribers' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('current');

  // Bumping this number changes the active panel's React key, which remounts
  // it and re-runs its mount-time fetch. Only one panel is mounted at a time,
  // so this refreshes whichever section the user is looking at. Per-panel
  // refresh icons do the same thing locally.
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const onRefreshAll = () => {
    setRefreshing(true);
    setRefreshSignal((s) => s + 1);
    // Spin the icon briefly to give visual feedback. The panel does its
    // own loading-state spinner on top of this so the user sees both.
    setTimeout(() => setRefreshing(false), 600);
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
            <div className="admin-header-actions">
              <button
                className="btn btn-secondary"
                onClick={onRefreshAll}
                title="Reload the data for the active section"
              >
                <FiRefreshCw className={refreshing ? 'spin' : ''} /> Refresh
              </button>
              <button className="btn btn-secondary" onClick={onLogout}>
                <FiLogOut /> Sign out
              </button>
            </div>
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

          <section className="admin-panel" key={`${tab}-${refreshSignal}`}>
            {tab === 'current' && <CurrentWorkPanel />}
            {tab === 'projects' && <ProjectsPanel />}
            {tab === 'blogs' && <BlogsPanel />}
            {tab === 'experience' && <ExperiencePanel />}
            {tab === 'subscribers' && <SubscribersPanel />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
