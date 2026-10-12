import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import './ThemeToggle.css';

const current = () => document.documentElement.getAttribute('data-theme') || 'dark';

// Switches <html data-theme>. Where the View Transitions API exists, the new
// theme grows out of the button as a circle; elsewhere it swaps instantly.
const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState(current);

  const apply = (next) => {
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    setTheme(next);
  };

  const onClick = (e) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) {
      apply(next);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const root = document.documentElement.style;
    root.setProperty('--vt-x', `${r.left + r.width / 2}px`);
    root.setProperty('--vt-y', `${r.top + r.height / 2}px`);
    const vt = document.startViewTransition(() => flushSync(() => apply(next)));
    // A skipped/aborted transition (e.g. background tab) must not surface as an error,
    // and the theme still has to change.
    vt.ready.catch(() => {});
    vt.finished.catch(() => {});
    vt.updateCallbackDone.catch(() => apply(next));
  };

  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={onClick}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? <FiSun /> : <FiMoon />}
    </button>
  );
};

export default ThemeToggle;
