import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAbout } from '../../services/aboutService';
import { fallbackAbout } from '../../data/fallback';
import './About.css';

// Sticky title on the left; on the right each word of the admin's About copy
// lights up as it scrolls through the viewport (CSS scroll-driven animation,
// plain text in browsers without it).
const About = () => {
  const [about, setAbout] = useState(fallbackAbout);

  useEffect(() => {
    let cancelled = false;
    getAbout()
      // Keep the bundled copy when nothing has been saved yet.
      .then((data) => !cancelled && data && setAbout({ ...fallbackAbout, ...data }))
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const paragraphs = about.paragraphs?.length ? about.paragraphs : fallbackAbout.paragraphs;
  const highlights = about.highlights?.length ? about.highlights : fallbackAbout.highlights;

  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-side">
          <div className="about-sticky">
            <span className="eyebrow ink">About</span>
            <h2 id="about-title">{about.title}</h2>
          </div>
        </div>

        <div className="about-main">
          {paragraphs.map((text, p) => (
            <p key={p} className="about-copy">
              {text.split(/\s+/).filter(Boolean).map((word, i) => (
                <React.Fragment key={i}><span className="about-word">{word}</span>{' '}</React.Fragment>
              ))}
            </p>
          ))}

          <motion.dl
            className="about-facts"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            {highlights.map((h, i) => (
              <div key={i}>
                <dt className="eyebrow">{h.label}</dt>
                <dd>{h.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
};

export default About;
