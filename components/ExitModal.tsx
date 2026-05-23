"use client";
import React, { useState, useEffect } from 'react';

export default function ExitModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`modal-overlay is-active ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <button onClick={handleClose} className="modal-close">✕</button>
        {!submitted ? (
          <>
            <h2 className="modal-title-huge">Wait.</h2>
            <p className="modal-text">Don't compromise on your morning routine. Drop your email to unlock <span className="highlight-bg">Free Global Shipping</span> on your pre-order.</p>
            <form onSubmit={handleSubmit} className="modal-form">
              <input type="email" required placeholder="Email Address..." className="modal-input" />
              <button type="submit" className="modal-btn">Unlock</button>
            </form>
          </>
        ) : (
          <div className="modal-success-msg">Code KINETIC10 Applied</div>
        )}
      </div>
    </div>
  );
}
