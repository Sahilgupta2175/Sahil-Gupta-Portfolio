import React, { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { sendContactMessage } from '../../services/contactService';
import { profile } from '../../data/profile';
import './Contact.css';

const EMPTY = { name: '', email: '', subject: '', message: '' };

// Round CTA that drifts toward the cursor while it's nearby.
const MagneticButton = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18 });
  const y = useSpring(my, { stiffness: 220, damping: 18 });

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.3);
    my.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <div className="magnet-zone" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.a className="magnet" href={`mailto:${profile.email}`} style={{ x, y }}>
        Write to me
        <span>replies in 24h</span>
      </motion.a>
    </div>
  );
};

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'submitting', message: '' });
    try {
      await sendContactMessage(form);
      setForm(EMPTY);
      setStatus({ state: 'success', message: "Message sent. I'll get back to you soon." });
    } catch (err) {
      setStatus({
        state: 'error',
        message: err.response?.data?.message || 'Could not send right now. Email me directly instead.'
      });
    }
  };

  const busy = status.state === 'submitting';

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <motion.a
          className="talk"
          href={`mailto:${profile.email}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span id="contact-title">Let's talk</span><span className="talk-dot">.</span>
        </motion.a>

        <div className="contact-body">
          <div className="contact-side">
            <MagneticButton />
            <dl className="contact-facts">
              <div><dt className="eyebrow">Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>
              <div><dt className="eyebrow">Phone</dt><dd><a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a></dd></div>
              <div><dt className="eyebrow">Based in</dt><dd>{profile.location}</dd></div>
            </dl>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <label>
              Name
              <input name="name" type="text" autoComplete="name" required maxLength={200} value={form.name} onChange={onChange} disabled={busy} />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required maxLength={320} value={form.email} onChange={onChange} disabled={busy} />
            </label>
            <label className="full">
              Subject
              <input name="subject" type="text" required maxLength={200} value={form.subject} onChange={onChange} disabled={busy} />
            </label>
            <label className="full">
              Message
              <textarea name="message" rows={5} required maxLength={5000} value={form.message} onChange={onChange} disabled={busy} />
            </label>
            <button type="submit" className="btn btn-solid full" disabled={busy}>
              {busy ? 'Sending…' : 'Send message'}
            </button>
            <p className={`form-status full ${status.state}`} role="status" aria-live="polite">{status.message}</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
