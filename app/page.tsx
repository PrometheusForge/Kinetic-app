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
    const featureBlocks = document.querySelectorAll('.feature-block');
    
    const stickyObserver = new IntersectionObserver((entries) => {
      //Filter elements leaving the screen
      const visibleEntries = entries.filter(entry => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        //If scrolling fast batches multiple elements, find the most visible one
        const dominantEntry = visibleEntries.reduce((prev, current) => {
          return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
        });

        const newImg = dominantEntry.target.getAttribute('data-img');
        
        if (newImg && newImg !== currentImgRef.current) {
          currentImgRef.current = newImg;
          
          if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
          
          setStickyImgOpacity(0);
          
          fadeTimeoutRef.current = setTimeout(() => {
            setStickyImgSrc(newImg);
            setStickyImgOpacity(1);
          }, 300);
        }
      }
    }, { 
      //Create 1-pixel tripwire in the middle
      rootMargin: "-50% 0px -50% 0px", 
      threshold: 0 
    });

    featureBlocks.forEach(block => stickyObserver.observe(block));
    
    return () => {
      stickyObserver.disconnect();
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

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
