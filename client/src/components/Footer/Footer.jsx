import React from 'react';
import { profile } from '../../data/profile';
import { homeTime, useNow } from '../../utils/hooks';
import './Footer.css';

const Footer = () => {
  const now = useNow(30000);
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {now.getFullYear()} {profile.name}</span>
        <span>Orai · {homeTime(now).hm} IST</span>
        <nav className="footer-links" aria-label="Social">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
        </nav>
        <a href="#main-content" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;
