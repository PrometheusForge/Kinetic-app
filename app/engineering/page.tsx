"use client";

import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function EngineeringPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll('.reveal, .img-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      
      <main>
        {/* The Manifesto */}
        <header className="page-header border-bottom-thick">
          <div className="container">
            <div className="reveal">
              <div className="header-label">The Manifesto</div>
              <br />
              <h1 className="page-title">
                Against The <br />
                <span style={{ color: 'var(--accent)' }}>Machine.</span>
              </h1>
              <br />
              <p className="manifesto-text">
                Coffee was never meant to be a push-button convenience. It is a physical, chemical extraction. 
                Adding microchips to an espresso machine is a planned obsolescence trap. We stripped away the pumps, the sensors, and the screens to give you back total control.
              </p>
            </div>
          </div>
        </header>

        {/* Editorial Section 1 */}
        <section className="editorial-section">
          <div className="editorial-row">
            <div className="editorial-image-box">
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop" 
                alt="Machining brass block" 
                className="editorial-img img-reveal" 
              />
            </div>
            <div className="editorial-content right-side reveal">
              <h2 className="section-heading">Machined,<br />Not Molded.</h2>
              <p className="section-body">
                We refuse to use injected plastics. Every structural component of the KINETIC base is CNC machined from a solid billet of Grade 5 Titanium and 304 Stainless Steel. 
              </p>
              <p className="section-body">
                The brew head itself is carved from a single piece of lead-free brass, providing unparalleled thermal stability that electronic thermoblocks simply cannot replicate.
              </p>
              <div className="data-point">
                <div className="data-value">18.4<span style={{ fontSize: '2rem' }}>lbs</span></div>
                <div className="data-label">Solid Brass Brew Head Mass</div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Section 2 */}
        <section className="editorial-section" style={{ borderTop: 'none' }}>
          <div className="editorial-row reverse">
            <div className="editorial-image-box reverse">
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop" 
                alt="Manual lever pull" 
                className="editorial-img img-reveal" 
              />
            </div>
            <div className="editorial-content reveal">
              <h2 className="section-heading">Compound<br />Leverage.</h2>
              <p className="section-body">
                Generating 9 bars of pressure manually usually requires immense physical strength. We solved this with geometry.
              </p>
              <p className="section-body">
                Our patented rack-and-pinion compound leverage system acts as a mechanical multiplier. It translates a smooth, effortless 10lb pull into precisely 130psi of water pressure directly onto the coffee puck. You feel the resistance of the coffee dynamically.
              </p>
              <div className="data-point">
                <div className="data-value">1:14</div>
                <div className="data-label">Mechanical Force Multiplier</div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs Table */}
        <section className="section-padding">
          <div className="container-sm">
            <div className="specs-header reveal">
              <h2 className="page-title" style={{ fontSize: '3rem', background: 'transparent' }}>The Blueprint.</h2>
              <p className="manifesto-text" style={{ fontSize: '1.125rem', maxWidth: '30rem', margin: '0 auto', background: 'transparent', textAlign: 'center' }}>
                No marketing fluff. Just raw metallurgical and physical specifications.
              </p>
            </div>

            <div className="spec-table reveal">
              <div className="spec-row">
                <div className="spec-key">Extraction Pressure</div>
                <div className="spec-value">Variable (0 - 12 Bar) via manual lever feedback.</div>
              </div>
              <div className="spec-row">
                <div className="spec-key">Portafilter Size</div>
                <div className="spec-value">Commercial Standard 58mm (Naked/Bottomless).</div>
              </div>
              <div className="spec-row">
                <div className="spec-key">Brew Chamber Capacity</div>
                <div className="spec-value">80ml total volume (suitable for ristretto to standard double shots).</div>
              </div>
              <div className="spec-row">
                <div className="spec-key">Chassis Material</div>
                <div className="spec-value">Powder-coated 304 Stainless Steel base, Grade 5 Titanium arms.</div>
              </div>
              <div className="spec-row">
                <div className="spec-key">Thermal Mass</div>
                <div className="spec-value">8.3kg (18.4lbs) solid lead-free brass brew head for zero temperature drop during pull.</div>
              </div>
              <div className="spec-row">
                <div className="spec-key">Footprint (W x D x H)</div>
                <div className="spec-value">140mm x 280mm x 320mm (Lever down).</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}