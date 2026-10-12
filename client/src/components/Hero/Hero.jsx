import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { profile } from '../../data/profile';
import './Hero.css';

const WORDS = profile.name.toUpperCase().split(' ');
const LETTER_COUNT = WORDS.join('').length;

// Weight/width for one letter given the cursor's x (0..1 across the name).
const axis = (cursor, center) => {
  const f = cursor < 0 ? 0 : Math.max(0, 1 - Math.abs(cursor - center) / 0.17);
  return { fontWeight: Math.round(800 - 600 * f), fontStretch: `${Math.round(100 - 25 * f)}%` };
};

const Hero = () => {
  const sectionRef = useRef(null);
  const frame = useRef(0);
  const [cursor, setCursor] = useState(-1);

  // Name shrinks and fades as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15]);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setCursor(x));
  };

  let index = 0;
  return (
    <section className="hero" id="hero" ref={sectionRef} aria-labelledby="hero-name">
      <div className="container">
        <div className="hero-meta eyebrow">
          <span>Portfolio · {new Date().getFullYear()}</span>
          <span>Full-stack developer</span>
          <span>{profile.location}</span>
        </div>

        <motion.div
          className="hero-name-wrap"
          style={{ scale, y, opacity }}
          onPointerMove={onMove}
          onPointerLeave={() => setCursor(-1)}
        >
          <h1 id="hero-name" className="hero-name" aria-label={profile.name}>
            {WORDS.map((word, w) => (
              <span className="hero-word" key={word} aria-hidden="true">
                {word.split('').map((ch) => {
                  const i = index++;
                  return (
                    <motion.span
                      key={i}
                      className="hero-letter"
                      style={axis(cursor, (i + 0.5) / LETTER_COUNT)}
                      initial={{ opacity: 0, y: '0.35em', filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.9, delay: 0.08 + i * 0.055, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      {ch}
                    </motion.span>
                  );
                })}
                {w === WORDS.length - 1 && (
                  <motion.span
                    className="hero-letter hero-dot"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    .
                  </motion.span>
                )}
              </span>
            ))}
          </h1>
        </motion.div>

        <div className="hero-foot">
          <p className="hero-tagline">
            I design and build web products end to end: auth, payments, real-time features and the last pixel.
            <span className="hero-hint"> Move your cursor over my name.</span>
          </p>
          <ScrollLink to="glance" href="#glance" smooth offset={-70} duration={600} className="hero-cue eyebrow">
            Scroll
            <span className="hero-cue-line" aria-hidden="true"><span /></span>
          </ScrollLink>
        </div>
      </div>
    </section>
  );
};

export default Hero;
