"use client";
import React, { useState, useRef, useEffect } from 'react';

export default function Checkout() {
  const [formData, setFormData] = useState({ finish: 'matte', email: '' });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) entries[0].target.classList.add('is-visible');
    });
    if (revealRef.current) observer.observe(revealRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      // If the backend successfully generated a Stripe session, redirect the user
      if (data.url) {
        window.location.href = data.url;
      } else {
        // If Stripe threw an error, log it and reset the UI
        console.error("No checkout URL returned:", data);
        setStatus('error');
      }
    } catch (err) {
      console.error("Checkout fetch failed:", err);
      setStatus('error');
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCheckout = async () => {
    setIsProcessing(true); // Triggers loading UI instantly
    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const { url } = await response.json();
      window.location.href = url; // Redirects
    } catch (error) {
      setIsProcessing(false); // Reverts if it fails
    }
  }

  return (
    <section id="checkout" className="checkout-section">
      <div className="container-sm">
        <div className="checkout-wrapper reveal" ref={revealRef}>
          <div className="checkout-preview">
            <div>
              <div className="checkout-title">KINETIC Base Unit</div>
              <p className="checkout-desc">Includes 58mm portafilter and tamper.</p>
            </div>
            <div className="checkout-img-box">
              <img src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=800&auto=format&fit=crop" className="checkout-img" alt="Kinetic Base Unit" />
            </div>
            <div className="checkout-price">$499</div>
          </div>
          <div className="checkout-form-container">
            <h3 className="form-title">Secure Your Order</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Finish</label>
                <div className="radio-grid">
                  <label style={{ cursor: 'pointer', position: 'relative' }}>
                    <input 
                      type="radio" 
                      className="sr-only radio-input" 
                      checked={formData.finish === 'matte'}
                      onChange={() => setFormData({...formData, finish: 'matte'})}
                    />
                    <div className="radio-box">Matte Black</div>
                  </label>
                  <label style={{ cursor: 'pointer', position: 'relative' }}>
                    <input 
                      type="radio" 
                      className="sr-only radio-input" 
                      checked={formData.finish === 'brass'}
                      onChange={() => setFormData({...formData, finish: 'brass'})}
                    />
                    <div className="radio-box">Raw Brass</div>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email for Receipt</label>
                <input 
                  type="email" 
                  required 
                  placeholder="you@example.com" 
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                onClick={handleCheckout} 
                className={`btn-submit ${status === 'processing' ? 'processing' : ''} ${status === 'success' ? 'success' : ''}`}
                disabled={status === 'processing' || status === 'success'}
              >
                {status === 'idle' && 'Proceed to Pay'}
                {status === 'processing' && 'Processing...'}
                {status === 'success' && 'Secured. Check Email.'}
                {status === 'error' && 'Error. Try Again.'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
