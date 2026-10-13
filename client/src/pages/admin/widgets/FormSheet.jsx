import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

// Slide-over panel that holds an admin form: a right-hand drawer on wide
// screens, a full-screen sheet on phones. Portalled to <body> so no parent
// (sticky header, backdrop-filter) can become its containing block.
// Esc or the backdrop closes it; the page behind doesn't scroll while open.
const FormSheet = ({ open, onClose, title, children }) => {
  const panelRef = useRef(null);
  // Panels pass a fresh onClose every render; keep the effect keyed on `open`
  // only so typing doesn't re-run it (and yank focus back to the first field).
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Land the cursor in the first field.
    const t = setTimeout(() => panelRef.current?.querySelector('input, textarea, select')?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="sheet-root">
          <motion.div
            className="sheet-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={panelRef}
            className="sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="sheet-head">
              <h2>{title}</h2>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
                <FiX />
              </button>
            </div>
            <div className="sheet-body">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FormSheet;
