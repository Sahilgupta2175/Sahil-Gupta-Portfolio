import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const toggle = (index) => setOpenIndex((prev) => (prev === index ? -1 : index));

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <motion.div
          className="faq-side"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h2 id="faq-title" className="display-title">FAQ</h2>
          <p>Quick answers to the things people ask most.</p>
        </motion.div>

        <div className="faq-list">
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
                    <span className="faq-icon" aria-hidden="true"><FiPlus /></span>
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
                      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
