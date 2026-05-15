"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const faqData = [
  {
    question: "When will Batch 04 ship?",
    answer: "Batch 04 is currently in production at our Berlin facility. Pre-orders placed today are guaranteed to ship by the second week of November. Tracking numbers will be sent via email once dispatched."
  },
  {
    question: "What kind of maintenance is required?",
    answer: "Minimal. Because there are no internal boilers, descaling is never required. The only maintenance is replacing the silicone piston O-rings every 2-3 years depending on usage. We sell replacement kits for $12."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes. We ship globally via DHL Express. Please note that international buyers are responsible for any localized import duties, VAT, or customs fees applied by their respective countries upon delivery."
  },
  {
    question: "What is the return policy?",
    answer: "We offer a 30-day \"Audition Period.\" If you don't fall in love with the workflow, pack the machine back into its original custom shipping crate and return it to us for a full refund (minus return shipping costs)."
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Entrance Animation Observer
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent to support team.');
    // In production, wire this to your backend/CRM webhook
  };

  return (
    <>
      <Navbar />
      
      <main>
        {/* Header Section */}
        <header className="support-header">
          <div className="container reveal">
            <h1 className="page-title">
              Built to <br />
              <span style={{ color: 'var(--accent)' }}>Outlive You.</span>
            </h1>
          </div>
        </header>

        {/* Warranty Box */}
        <div className="container">
          <div className="warranty-box reveal">
            <div className="warranty-title">100-Year Guarantee</div>
            <p className="warranty-text">
              The KINETIC has zero electronic components. No pumps to fail, no motherboards to short circuit. We guarantee the structural integrity of the chassis and brew head for 100 years. If it breaks, we replace it.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="faq-section section-padding">
          <div className="container-sm">
            <div className="faq-header reveal">
              <h2 className="page-title" style={{ fontSize: '3rem' }}>Questions.</h2>
            </div>

            <div className="faq-list reveal">
              {faqData.map((faq, index) => {
                const isActive = openFaq === index;
                
                return (
                  <div key={index} className={`faq-item ${isActive ? 'active' : ''}`}>
                    <button 
                      className="faq-question" 
                      onClick={() => toggleFaq(index)}
                    >
                      {faq.question} <span className="faq-icon">+</span>
                    </button>
                    <div 
                      className="faq-answer"
                      ref={(el) => { contentRefs.current[index] = el; }}
                      style={{ 
                        maxHeight: isActive && contentRefs.current[index] 
                          ? `${contentRefs.current[index]?.scrollHeight}px` 
                          : '0px' 
                      }}
                    >
                      <div className="faq-answer-inner">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Parts Grid */}
        <section className="section-padding">
          <div className="container">
            <div className="contact-grid">
              
              <div className="parts-box reveal">
                <h2 className="parts-title">Replacement <br />Parts.</h2>
                <p className="parts-text">
                  We don't want you to buy a new machine. We want you to maintain this one forever. Order OEM replacement silicone seals, naked portafilter baskets, and pressure gauges directly from the factory.
                </p>
                <button 
                  className="btn-submit" 
                  style={{ backgroundColor: 'white', color: 'var(--ink)' }}
                >
                  View Parts Store →
                </button>
              </div>

              <div className="reveal">
                <h2 className="parts-title">Direct Line.</h2>
                <form onSubmit={handleSupportSubmit}>
                  <div className="form-group">
                    <label className="form-label">Order Number (Optional)</label>
                    <input type="text" className="form-input" placeholder="#KN-XXXX" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" required className="form-input" placeholder="you@example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Inquiry</label>
                    <textarea required className="form-textarea" placeholder="How can we help?"></textarea>
                  </div>
                  <button type="submit" className="btn-submit">Submit Ticket</button>
                </form>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}