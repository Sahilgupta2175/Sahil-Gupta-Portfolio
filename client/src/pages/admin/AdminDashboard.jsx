import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiActivity, FiBriefcase, FiEdit3, FiExternalLink, FiGrid, FiLogOut, FiMail, FiMenu, FiRefreshCw, FiUser, FiX
} from 'react-icons/fi';
import { logout } from '../../services/authService';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import AboutPanel from './panels/AboutPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import BlogsPanel from './panels/BlogsPanel';
import ExperiencePanel from './panels/ExperiencePanel';
import CurrentWorkPanel from './panels/CurrentWorkPanel';
import SubscribersPanel from './panels/SubscribersPanel';
import './Admin.css';

// `where` tells the editor which part of the public site each panel feeds.
const TABS = [
  { key: 'current', label: 'Current work', Icon: FiActivity, Panel: CurrentWorkPanel, where: 'Homepage · "Right now" tile' },
  { key: 'about', label: 'About', Icon: FiUser, Panel: AboutPanel, where: 'Homepage · About section and stat tile' },
  { key: 'projects', label: 'Projects', Icon: FiGrid, Panel: ProjectsPanel, where: 'Homepage · Selected work, and /projects' },
  { key: 'blogs', label: 'Blogs', Icon: FiEdit3, Panel: BlogsPanel, where: 'Homepage · Writing, and /blogs' },
  { key: 'experience', label: 'Experience', Icon: FiBriefcase, Panel: ExperiencePanel, where: 'Homepage · Journey tickets' },
  { key: 'subscribers', label: 'Subscribers', Icon: FiMail, Panel: SubscribersPanel, where: 'People on the new-post email list' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('current');
  // Phones/tablets: the section list lives behind a hamburger instead of a
  // sideways-scrolling tab strip.
  const [menuOpen, setMenuOpen] = useState(false);

  // Bumping this number changes the active panel's React key, which remounts
  // it and re-runs its mount-time fetch.
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const pick = (key) => {
    setTab(key);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const onLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const onRefreshAll = () => {
    setRefreshing(true);
    setRefreshSignal((s) => s + 1);
    setTimeout(() => setRefreshing(false), 600);
  };

  const active = TABS.find((t) => t.key === tab);

  useEffect(() => {
    document.title = `${active.label} · Admin · Sahil Gupta`;
  }, [active.label]);
  const email = localStorage.getItem('admin_email');

  return (
    <div className="admin-shell">
      <aside className={`admin-side ${menuOpen ? 'is-open' : ''}`}>
        <div className="admin-side-top">
          <Link to="/" className="admin-brand">
            <span className="admin-brand-mark" aria-hidden="true">S</span>
            <span>
              <strong>Portfolio admin</strong>
              {email && <small>{email}</small>}
            </span>
          </Link>
          <button
            type="button"
            className="admin-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="admin-menu"
            aria-label={menuOpen ? 'Close sections menu' : 'Open sections menu'}
          >
            <span className="admin-burger-label">{active.label}</span>
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>

        <div className="admin-menu" id="admin-menu">
          <nav className="admin-nav" aria-label="Content sections">
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => pick(key)}
                className={`admin-nav-item ${tab === key ? 'active' : ''}`}
                aria-current={tab === key ? 'page' : undefined}
              >
                <Icon aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>

          <div className="admin-side-foot">
            <Link to="/" className="admin-side-link">
              <FiExternalLink aria-hidden="true" /> View site
            </Link>
            <div className="admin-side-row">
              <ThemeToggle />
              <button type="button" className="btn btn-secondary admin-logout" onClick={onLogout}>
                <FiLogOut aria-hidden="true" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>
      {menuOpen && <button type="button" className="admin-menu-backdrop" aria-label="Close sections menu" onClick={() => setMenuOpen(false)} />}

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="eyebrow">{active.where}</span>
            <h1 className="admin-title">{active.label}</h1>
            <p className="admin-sub">Changes go live on the site as soon as you save.</p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRefreshAll}
            title="Reload the data for this section"
          >
            <FiRefreshCw className={refreshing ? 'spin' : ''} aria-hidden="true" /> Refresh
          </button>
        </header>

        <section className="admin-panel" key={`${tab}-${refreshSignal}`}>
          <active.Panel />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
