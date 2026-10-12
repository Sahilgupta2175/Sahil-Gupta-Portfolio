import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="loader"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      role="status"
      aria-label="Loading"
    >
      <div className="loader-content">
        <div className="loader-logo" aria-hidden="true">
          {'SG'.split('').map((ch, i) => (
            <motion.span
              key={ch}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          <motion.span
            className="loader-dot"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 16 }}
          >
            .
          </motion.span>
        </div>
        <div className="loader-progress">
          <div className="loader-progress-bar" style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }} />
        </div>
        <p className="loader-text">
          <span>Loading</span>
          <span>{String(Math.min(Math.round(progress), 100)).padStart(3, '0')}%</span>
        </p>
      </div>
    </motion.div>
  );
};

export default Loader;
