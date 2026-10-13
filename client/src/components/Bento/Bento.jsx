import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link as ScrollLink } from 'react-scroll';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import { getAbout } from '../../services/aboutService';
import { listCurrentWork } from '../../services/currentWorkService';
import { listExperience } from '../../services/experienceService';
import { fallbackAbout, fallbackExperience } from '../../data/fallback';
import { profile, stack, stats } from '../../data/profile';
import { homeTime, splitNumber, useCountUp, useNow } from '../../utils/hooks';
import './Bento.css';

const tileMotion = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] } })
};

const Tile = ({ i, className = '', as = 'div', children, ...rest }) => {
  const Comp = motion[as];
  return (
    <Comp className={`tile ${className}`} variants={tileMotion} custom={i} {...rest}>
      {children}
    </Comp>
  );
};

const Clock = () => {
  const { hm, s, hour } = homeTime(useNow(1000));
  const awake = hour >= 8;
  return (
    <>
      <span className="eyebrow">Local time · IST</span>
      <div className="tile-big tile-clock">
        {hm}<span>:{s}</span>
      </div>
      <span className="tile-mood">
        <span className="dot" style={awake ? undefined : { background: 'var(--muted)', animation: 'none' }} />
        {awake ? 'Probably shipping code' : 'Probably asleep, reply by morning'}
      </span>
    </>
  );
};

// The admin's open role is the one whose period says "Present".
const currentRole = (list) =>
  list.find((e) => /present/i.test(e.period || '') && e.employmentType === 'Full-time') ||
  list.find((e) => /present/i.test(e.period || ''));

const Bento = () => {
  const gridRef = useRef(null);
  const [about, setAbout] = useState(fallbackAbout);
  const [now, setNow] = useState([]);
  const [role, setRole] = useState(() => currentRole(fallbackExperience));
  const [viewRef, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    let cancelled = false;
    getAbout()
      .then((d) => !cancelled && d && setAbout({ ...fallbackAbout, ...d }))
      .catch(() => {});
    listCurrentWork()
      .then((d) => !cancelled && setNow(d || []))
      .catch(() => {});
    listExperience()
      .then((d) => !cancelled && d?.length && setRole(currentRole(d)))
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const badge = splitNumber(about.badgeNumber);
  const solved = useCountUp(badge.value, inView);
  const cgpa = useCountUp(stats.cgpa, inView);
  const rate = useCountUp(stats.successRate, inView);

  // Spotlight: each tile gets --mx/--my in its own coordinates, no re-render.
  const onMove = (e) => {
    gridRef.current?.querySelectorAll('.tile').forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  };

  const setRefs = (el) => {
    gridRef.current = el;
    viewRef(el);
  };

  return (
    <section className="bento-section" id="glance" aria-label="At a glance">
      <div className="container">
        <motion.div
          ref={setRefs}
          className="bento"
          onPointerMove={onMove}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Tile i={0} className="s2 r2 tile-intro">
            <span className="pill">
              <span className="dot" />
              Full-stack developer{role ? ` · ${role.company}` : ''}
            </span>
            <div className="tile-intro-body">
              <h2>
                MERN developer who ships <em>real products</em>, not just repos.
              </h2>
              {/* Developer work first, then the day job. College lives only in Journey › Education. */}
              <p>
                I build end-to-end web apps with React, Node.js, Express and MongoDB.
                {role && ` Professionally, I'm a ${role.role} at ${role.company}${profile.team ? ` (${profile.team})` : ''}, working on U.S. healthcare payer systems.`}
              </p>
            </div>
            <div className="tile-actions">
              <ScrollLink to="projects" href="#projects" smooth offset={-70} duration={600} className="btn btn-primary">
                See projects <FiArrowDown aria-hidden="true" />
              </ScrollLink>
              <ScrollLink to="contact" href="#contact" smooth offset={-70} duration={800} className="btn btn-secondary">
                Say hello
              </ScrollLink>
            </div>
          </Tile>

          <Tile i={1} className="r2 tile-photo">
            <img src={profile.photo} alt={`Portrait of ${profile.name}`} />
            <div className="tile-photo-cap">
              <strong>{profile.name}</strong>
              <span>{role ? `${role.company}${profile.team ? ` · ${profile.team}` : ''}` : 'Full-stack developer'}</span>
            </div>
          </Tile>

          <Tile i={2} className="tile-time">
            <Clock />
          </Tile>

          <Tile i={3} className="tile-stat">
            <span className="eyebrow">LeetCode + HackerRank</span>
            <div className="tile-big">
              {Number.isFinite(badge.value) ? Math.round(solved) : ''}
              <span className="ink">{badge.suffix}</span>
            </div>
            <div className="tile-stat-foot">
              <span>{String(about.badgeText || '').replace(/\n/g, ' ').toLowerCase()}</span>
              <span className="bar"><span style={{ transform: `scaleX(${Number.isFinite(badge.value) ? solved / (badge.value || 1) : 1})` }} /></span>
            </div>
          </Tile>

          <Tile i={4} className="s2 tile-now">
            <div className="tile-row-head">
              <span className="eyebrow">Right now</span>
              <span className="eyebrow">{now.length} active</span>
            </div>
            {now.length === 0 && <p className="tile-empty">Heads down on something new. More soon.</p>}
            {now.map((item, i) => {
              const Row = item.link ? 'a' : 'div';
              const linkProps = item.link ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' } : {};
              return (
                <Row key={item._id || i} className={`now-row ${item.link ? 'is-link' : ''}`} {...linkProps}>
                  <span className={`now-status ${i === 0 ? 'lead' : ''}`}>{item.status || 'Building'}</span>
                  <span className="now-text">
                    <strong>{item.emoji ? `${item.emoji} ` : ''}{item.title}</strong>
                    {item.description && <span>{item.description}</span>}
                  </span>
                  {item.link && <FiArrowUpRight aria-hidden="true" />}
                </Row>
              );
            })}
          </Tile>

          <Tile i={5} className="tile-grade">
            <div>
              <span className="tile-mid">{cgpa.toFixed(2)}</span>
              <span>CGPA, B.Tech (Hons) CS</span>
            </div>
            <div>
              <span className="tile-mid">{Math.round(rate)}<span className="ink">%</span></span>
              <span>challenge success rate</span>
            </div>
          </Tile>

          <Tile i={6} className="tile-social">
            <span className="eyebrow">Elsewhere</span>
            <div>
              {profile.socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}<FiArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </Tile>

          <Tile i={7} className="s3 tile-stack">
            <div className="tile-row-head">
              <span className="eyebrow">Stack</span>
              <span className="tile-note">Each project below lists what it was built with</span>
            </div>
            <div className="tile-chips">
              {stack.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </Tile>

          <Tile i={8} as="a" className="tile-resume" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
            <span className="tile-row-head">
              <span className="eyebrow">PDF</span>
              <FiArrowUpRight className="tile-resume-arrow" aria-hidden="true" />
            </span>
            <span className="tile-resume-label">Grab my<br />résumé</span>
          </Tile>
        </motion.div>
      </div>
    </section>
  );
};

export default Bento;
