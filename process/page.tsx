"use client";

import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProcessPage() {
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
        {/* Header Section */}
        <header className="process-header">
          <div className="container header-content reveal">
            <h1 className="process-title">
              The <span style={{ color: 'var(--accent)' }}>Workflow.</span>
            </h1>
            <p className="process-subtitle">
              Great espresso requires intentionality. The KINETIC machine strips away the automation so you can intimately connect with the variables of extraction. This is the process.
            </p>
          </div>
        </header>

        {/* Process Steps */}
        <section className="process-section">
          
          {/* Step 1 */}
          <div className="step-row">
            <div className="step-visual">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop" 
                alt="Coffee Grinding" 
                className="step-img img-reveal" 
              />
            </div>
            <div className="step-content reveal">
              <div className="step-number">01</div>
              <h2 className="step-title">The Dose.</h2>
              <p className="step-desc">
                Begin with fresh, light-to-medium roast beans. The KINETIC's 58mm basket is designed for a precision 18-gram dose. Grind size is critical; you are looking for a fine, powdery consistency that clumps slightly when pinched.
              </p>
              <div className="specs-box">
                <div className="specs-row"><span className="spec-label">Ideal Dose</span><span className="spec-value">18.0g</span></div>
                <div className="specs-row"><span className="spec-label">Grind Profile</span><span className="spec-value">Fine / Espresso</span></div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step-row reverse">
            <div className="step-visual">
              <img 
                src="https://images.unsplash.com/photo-1610889556528-9a770e32642f?q=80&w=1000&auto=format&fit=crop" 
                alt="Puck Preparation" 
                className="step-img img-reveal" 
              />
            </div>
            <div className="step-content reveal">
              <div className="step-number">02</div>
              <h2 className="step-title">Distribution.</h2>
              <p className="step-desc">
                Dump the grounds into the naked portafilter. Use a WDT (Weiss Distribution Technique) tool to aggressively break up clumps and create a perfectly homogenous bed. Tamp evenly with exactly 30lbs of pressure to ensure zero channeling.
              </p>
              <div className="specs-box">
                <div className="specs-row"><span className="spec-label">Tool</span><span className="spec-value">0.3mm WDT Needles</span></div>
                <div className="specs-row"><span className="spec-label">Tamp Force</span><span className="spec-value">30 lbs (Level)</span></div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-row">
            <div className="step-visual">
              <img 
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop" 
                alt="Lever Pull" 
                className="step-img img-reveal" 
              />
            </div>
            <div className="step-content reveal">
              <div className="step-number">03</div>
              <h2 className="step-title">Pre-Infusion.</h2>
              <p className="step-desc">
                Lock the portafilter in. Pour boiling water into the brass cylinder. Gently pull the lever down until you feel resistance—this is water hitting the puck. Hold this position for exactly 8 seconds to saturate the grounds and release CO2.
              </p>
              <div className="specs-box">
                <div className="specs-row"><span className="spec-label">Water Temp</span><span className="spec-value">93°C - 96°C</span></div>
                <div className="specs-row"><span className="spec-label">Dwell Time</span><span className="spec-value">8 - 10 Seconds</span></div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="step-row reverse border-bottom-thick">
            <div className="step-visual">
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop" 
                alt="Espresso Extraction" 
                className="step-img img-reveal" 
              />
            </div>
            <div className="step-content reveal">
              <div className="step-number">04</div>
              <h2 className="step-title">The Pull.</h2>
              <p className="step-desc">
                Press firmly through the resistance. The compound lever allows you to sustain 9 bars of pressure. As the shot blondes toward the end, taper off your pressure to 6 bars to avoid extracting bitter tannins. Stop at a 36g yield.
              </p>
              <div className="specs-box">
                <div className="specs-row"><span className="spec-label">Peak Pressure</span><span className="spec-value">9 Bar</span></div>
                <div className="specs-row"><span className="spec-label">Final Yield</span><span className="spec-value">36.0g</span></div>
                <div className="specs-row"><span className="spec-label">Shot Time</span><span className="spec-value">25 - 30s</span></div>
              </div>
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}