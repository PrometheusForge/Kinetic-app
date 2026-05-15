"use client";
import React, { useEffect, useRef } from 'react';

export default function Hero() {
  const revealRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (revealRef.current) observer.observe(revealRef.current);
    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="reveal" ref={revealRef}>
          <div className="hero-badge">Batch 04 — Ships November</div>
          <h1 className="hero-title">
            Pure <br/><span>Extraction.</span>
          </h1>
          <p className="hero-desc">
            The world's first gravity-assisted manual espresso press. Zero electronics. Total control. Machined from solid brass and stainless steel.
          </p>
          <div className="hero-action-group">
            <button onClick={scrollToCheckout} className="btn-large">
              Reserve for $499
            </button>
            <div className="hero-scarcity">Only 500 Available</div>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="visual-grid"></div>
        <img 
          ref={imgRef}
          src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1000&auto=format&fit=crop" 
          alt="Espresso Machine" 
          className="hero-img img-reveal" 
        />
        <div className="hero-stamp">NO PLASTIC.</div>
      </div>
    </section>
  );
}