"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import Checkout from '../components/Checkout';
import Footer from '../components/Footer';
import ExitModal from '../components/ExitModal';

export default function Home() {
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitTriggered, setExitTriggered] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0 && !exitTriggered) {
        setExitTriggered(true);
        setShowExitModal(true);
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [exitTriggered]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <Reviews />
        <Checkout />
      </main>
      <Footer />
      {showExitModal && <ExitModal onClose={() => setShowExitModal(false)} />}
    </>
  );
}
