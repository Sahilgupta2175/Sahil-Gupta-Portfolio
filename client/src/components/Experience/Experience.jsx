import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { listExperience } from '../../services/experienceService';
import { fallbackExperience } from '../../data/fallback';
import { education, extras } from '../../data/profile';
import './Experience.css';

const TABS = [
  { key: 'Full-time', label: 'Full-time' },
  { key: 'Internship', label: 'Internships' },
  { key: 'Education', label: 'Education' }
];

// Docs created before employmentType existed have no value; treat them as
// internships so they stay visible instead of vanishing from both tabs.
const typeOf = (exp) => (exp.employmentType === 'Full-time' ? 'Full-time' : 'Internship');

const ticketMotion = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] } }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } }
};

const Ticket = ({ i, stub, children }) => (
  <motion.article className="ticket" variants={ticketMotion} custom={i} initial="hidden" animate="show" exit="exit">
    <div className="ticket-stub">{stub}</div>
    <div className="ticket-main">{children}</div>
  </motion.article>
);

const Experience = () => {
  const [items, setItems] = useState(fallbackExperience);
  const [tab, setTab] = useState(() =>
    fallbackExperience.some((e) => typeOf(e) === 'Full-time') ? 'Full-time' : 'Internship'
  );

  useEffect(() => {
    let cancelled = false;
    listExperience()
      .then((data) => {
        if (cancelled || !data?.length) return;
        setItems(data);
        setTab(data.some((e) => typeOf(e) === 'Full-time') ? 'Full-time' : 'Internship');
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const count = (key) => (key === 'Education' ? education.length : items.filter((e) => typeOf(e) === key).length);
  const visible = items.filter((e) => typeOf(e) === tab);

  return (
    <section className="journey" id="experience" aria-labelledby="journey-title">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h2 id="journey-title" className="display-title">Journey</h2>
          <div className="seg" role="tablist" aria-label="Experience type">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`seg-btn journey-tab ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {tab === t.key && (
                  <motion.span
                    className="journey-pill"
                    layoutId="journey-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="journey-tab-label">
                  {t.label}<span className="count">{count(t.key)}</span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="tickets" role="tabpanel" aria-label={tab}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} className="tickets-list">
              {tab === 'Education' ? (
                <>
                  {education.map((ed, i) => (
                    <Ticket
                      key={ed.title}
                      i={i}
                      stub={
                        <>
                          <span className="eyebrow">Education · {ed.score}</span>
                          <span className="ticket-period">{ed.period}</span>
                        </>
                      }
                    >
                      <h3>{ed.title}</h3>
                      <p className="ticket-org">{ed.field}</p>
                      <p>{ed.institution}</p>
                    </Ticket>
                  ))}
                  <div className="ticket-extras">
                    {[...extras.certifications, ...extras.languages].map((x) => (
                      <span key={x} className="chip">{x}</span>
                    ))}
                  </div>
                </>
              ) : visible.length === 0 ? (
                <motion.div className="ticket ticket-empty" variants={ticketMotion} custom={0} initial="hidden" animate="show" exit="exit">
                  <div className="ticket-stub">
                    <span className="eyebrow">Admit one · {tab}</span>
                    <span className="ticket-period">Open →</span>
                  </div>
                  <div className="ticket-main">
                    <h3>This seat is still open.</h3>
                    <p>No {tab.toLowerCase()} roles listed yet. Looking for a team that ships often.</p>
                    <ScrollLink to="contact" href="#contact" smooth offset={-70} duration={700} className="btn btn-primary">
                      Start a conversation
                    </ScrollLink>
                  </div>
                </motion.div>
              ) : (
                visible.map((exp, i) => (
                  <Ticket
                    key={exp._id || i}
                    i={i}
                    stub={
                      <>
                        <span className="ticket-stub-top">
                          {exp.logo ? (
                            <img className="ticket-logo" src={exp.logo} alt={`${exp.company} logo`} />
                          ) : (
                            <span className="ticket-logo ticket-logo-gen" aria-hidden="true">{exp.company?.[0]}</span>
                          )}
                          <span className="eyebrow">{typeOf(exp)}{exp.location ? ` · ${exp.location}` : ''}</span>
                        </span>
                        <span className="ticket-period">{exp.period}</span>
                      </>
                    }
                  >
                    <h3>{exp.role}</h3>
                    <p className="ticket-org">{exp.company}</p>
                    {exp.description && <p className="ticket-desc">{exp.description}</p>}
                    {exp.achievements?.length > 0 && (
                      <ul>
                        {exp.achievements.map((a, j) => <li key={j}>{a}</li>)}
                      </ul>
                    )}
                    {exp.technologies?.length > 0 && (
                      <div className="ticket-tech">
                        {exp.technologies.map((t) => <span key={t}>{t}</span>)}
                      </div>
                    )}
                  </Ticket>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Experience;
