import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowUpRight } from 'react-icons/fi';
import { listCurrentWork } from '../../services/currentWorkService';
import './CurrentWork.css';

// Compact "what I'm doing right now" section. Renders nothing when the
// admin hasn't published anything — keeps the homepage tight on first deploy.
const CurrentWork = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    let cancelled = false;
    listCurrentWork()
      .then((data) => !cancelled && setItems(data || []))
      .catch(() => !cancelled && setItems([]))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  // Hide the whole section when there's nothing to show.
  if (!loading && items.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const card = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="current-work" id="current-work" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">
            <span className="live-dot" /> Live
          </span>
          <h2 className="section-title">Currently Working On</h2>
          <p className="section-description">
            What I'm building, learning, or shipping right now
          </p>
        </motion.div>

        <motion.div
          className={`current-work-grid count-${Math.min(items.length, 3)}`}
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {items.map((item) => {
            // Card is a link only when a URL is provided — clickable feels
            // better than a non-functional button.
            const Wrapper = item.link ? motion.a : motion.div;
            const wrapperProps = item.link
              ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <Wrapper
                key={item._id}
                className={`cw-card ${item.link ? 'is-link' : ''}`}
                variants={card}
                whileHover={{ y: -6 }}
                {...wrapperProps}
              >
                <div className="cw-card-head">
                  <span className="cw-emoji">{item.emoji || '🚀'}</span>
                  <span className="cw-status">{item.status || 'Building'}</span>
                </div>
                <h3 className="cw-title">{item.title}</h3>
                <p className="cw-description">{item.description}</p>
                {item.link && (
                  <span className="cw-link">
                    View details <FiArrowUpRight />
                  </span>
                )}
              </Wrapper>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentWork;
