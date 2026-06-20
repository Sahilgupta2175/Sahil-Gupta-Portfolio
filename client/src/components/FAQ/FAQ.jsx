import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiPlus } from 'react-icons/fi';
import './FAQ.css';

// The questions here are intentionally kept in sync with the FAQPage JSON-LD
// in public/index.html so search/AI engines and human visitors see the same
// answers.
const faqs = [
  {
    q: 'Who is Sahil Gupta?',
    a: "I'm a full-stack MERN developer and B.Tech Computer Science (Honors) student at GLA University, Mathura, based in Orai, Uttar Pradesh, India. I build scalable web applications using React, Node.js, Express and MongoDB."
  },
  {
    q: 'What technologies do you work with?',
    a: 'I work across the MERN stack — React.js, Node.js, Express.js and MongoDB — along with JavaScript, Java, REST APIs, SQL/PostgreSQL, Git, and tools like Postman, Vercel and Cloudinary.'
  },
  {
    q: 'Are you available for hire or freelance work?',
    a: "Yes! I'm open to new opportunities, freelance projects and collaborations. The fastest way to reach me is by email or through the contact form on this page."
  },
  {
    q: 'What kind of projects have you built?',
    a: 'I\'ve built full-stack projects including a Vehicle Rental Services platform, a Zerodha stock-trading clone, the Wanderlust property-rental app, the InShare file-sharing app, and a Netflix UI clone.'
  },
  {
    q: 'How can I contact you?',
    a: 'Email me at guptasahil2175@gmail.com, call +91 9956564108, or use the contact form below. You can also connect on GitHub (Sahilgupta2175) and LinkedIn (sahilgupta2175).'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const toggle = (index) => setOpenIndex((prev) => (prev === index ? -1 : index));

  return (
    <section className="faq" id="faq" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-description">
            Quick answers to the things people most often ask me
          </p>
        </motion.div>

        <motion.div
          className="faq-list"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <h3 className="faq-question-heading">
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                    onClick={() => toggle(index)}
                  >
                    <span>{item.q}</span>
                    <motion.span
                      className="faq-icon"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiPlus />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer"
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
