"use client";
import React, { useEffect, useState, useRef } from 'react';

export default function Reviews() {
  const [remaining, setRemaining] = useState(48);
  const [flash, setFlash] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const totalCards = 8;

  useEffect(() => {
    

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (headerRef.current) observer.observe(headerRef.current);
    if (gridRef.current) observer.observe(gridRef.current);
    if (carouselRef.current) observer.observe(carouselRef.current);

    const interval = setInterval(() => {
      if (Math.random() > 0.8 && remaining > 12) {
        setRemaining(prev => prev - 1);
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
      }
    }, 5000);

    const carousel = carouselRef.current;
    const handleScroll = () => {
      if (!carousel) return;
      const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
      setActiveSlide(index);
    };
    if (carousel) carousel.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      clearInterval(interval);
      if (carousel) carousel.removeEventListener('scroll', handleScroll);
    };

  }, [remaining]);

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <div className="reviews-header reveal" ref={headerRef}>
          <div>
            <h2 className="reviews-title">The Verdict.</h2>
            <p className="reviews-subtitle">Data gathered from 1,200 early adopters.</p>
          </div>

          <div className={`live-data-indicator ${flash ? 'flash' : ''}`}>
            <div className="pulse-dot"></div>
            <div><span className="live-number">{remaining}</span> Units remaining in Batch 04</div>
          </div>
        </div>

        <div className="reviews-grid reveal" ref={gridRef}>{/*mobile hidden*/}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"The workflow is meditative. It completely replaced my $3,000 dual-boiler machine. The clarity of the espresso is unmatched."</p>
              <div className="review-author">James Hoffman • Barista</div>
            </div>

            <div className="review-card highlight">
              <div className="review-stars">★★★★★</div>
              <h3 className="review-text-large">"A triumph of industrial design."</h3>
              <div className="review-author">— Wired Magazine</div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
              <div className="review-author">Sarah Jenkins • Architect</div>
            </div>

            <div className="review-card highlight">
              <div className="review-stars">★★★★★</div>
              <h3 className="review-text-large">"A triumph of industrial design."</h3>
              <div className="review-author">— Wired Magazine</div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
              <div className="review-author">Sarah Jenkins • Architect</div>
            </div>

            <div className="review-card highlight">
              <div className="review-stars">★★★★★</div>
              <h3 className="review-text-large">"A triumph of industrial design."</h3>
              <div className="review-author">— Wired Magazine</div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
              <div className="review-author">Sarah Jenkins • Architect</div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
              <div className="review-author">Sarah Jenkins • Architect</div>
            </div>

             <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
              <div className="review-author">Sarah Jenkins • Architect</div>
            </div>
        </div>

        <div className="reviews-carousel" ref={carouselRef}>{/*desktop hidden*/}
          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"The workflow is meditative. It completely replaced my $3,000 dual-boiler machine. The clarity of the espresso is unmatched."</p>
            <div className="review-author">James Hoffman • Barista</div>
          </div>

          <div className="review-card highlight">
            <div className="review-stars">★★★★★</div>
            <h3 className="review-text-large">"A triumph of industrial design."</h3>
            <div className="review-author">— Wired Magazine</div>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
            <div className="review-author">Sarah Jenkins • Architect</div>
          </div>

          <div className="review-card highlight">
            <div className="review-stars">★★★★★</div>
            <h3 className="review-text-large">"A triumph of industrial design."</h3>
            <div className="review-author">— Wired Magazine</div>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
            <div className="review-author">Sarah Jenkins • Architect</div>
          </div>

          <div className="review-card highlight">
            <div className="review-stars">★★★★★</div>
            <h3 className="review-text-large">"A triumph of industrial design."</h3>
            <div className="review-author">— Wired Magazine</div>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
            <div className="review-author">Sarah Jenkins • Architect</div>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"Built like a tank. No pumps to break, no circuits to fry. This is an heirloom piece that will outlive me."</p>
            <div className="review-author">Sarah Jenkins • Architect</div>
          </div>
        </div>

        {/* Dot indicators — mobile only */}
        <div className="carousel-dots">
          {Array.from({ length: totalCards }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === activeSlide ? 'active' : ''}`}
              onClick={() => {
                carouselRef.current?.scrollTo({ left: i * carouselRef.current.offsetWidth, behavior: 'smooth' });
              }}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
