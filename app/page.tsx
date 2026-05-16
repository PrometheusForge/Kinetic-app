"use client";

import React, { useState, useEffect, useRef } from 'react';
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

  // 1. ADDED MISSING STATE AND REFS HERE
  const defaultImage = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop';
  const [stickyImgSrc, setStickyImgSrc] = useState(defaultImage);
  const currentImgRef = useRef(defaultImage);

  // Intersection Observer for Pure, Instant Image Swap
  useEffect(() => {
    const featureBlocks = document.querySelectorAll('.feature-block');
    
    const stickyObserver = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // Find the element most centered on the screen
        const dominantEntry = visibleEntries.reduce((prev, current) => {
          return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
        });

        const newImg = dominantEntry.target.getAttribute('data-img');
        
        // Instantly swap the image src if it's new, no timeouts or opacity changes
        if (newImg && newImg !== currentImgRef.current) {
          currentImgRef.current = newImg;
          setStickyImgSrc(newImg); 
        }
      }
    }, { 
      rootMargin: "-50% 0px -50% 0px", 
      threshold: 0 
    });

    featureBlocks.forEach(block => stickyObserver.observe(block));
    
    return () => {
      stickyObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        {/* 2. PASSED THE IMAGE STATE AS A PROP TO FEATURES */}
        <Features currentImage={stickyImgSrc} />
        <Reviews />
        <Checkout />
      </main>
      <Footer />
      {showExitModal && <ExitModal onClose={() => setShowExitModal(false)} />}
    </>
  );
}
