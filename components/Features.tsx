"use client";
import React, { useEffect, useRef, useState } from 'react';

const featureData = [
  { id: 1, img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop', num: '01', title: 'Naked Portafilter.', desc: 'Watch the extraction happen in real time. The 58mm commercial-grade naked portafilter ensures perfect channeling visibility.' },
  { id: 2, img: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?q=80&w=800&auto=format&fit=crop', num: '02', title: 'Kinetic Lever.', desc: 'Our patented compound-leverage system translates 10lbs of human force into a flawless 9-bar pressure curve.' },
  { id: 3, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop', num: '03', title: 'Thermal Mass.', desc: 'Weighing 18lbs, the solid brass brew head retains boiling water temperatures with absolute stability throughout the pull.' },
  { id: 4, img: 'https://plus.unsplash.com/premium_photo-1674327105074-46dd8319164b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', num: '04', title: 'Advanced Filtration.', desc: 'Experience the difference with our state-of-the-art filtration system.' }
];

export default function Features() {
  const [activeImg, setActiveImg] = useState(featureData[0].img);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    featureData.forEach(feat => {
      const img = new Image();
      img.src = feat.img;
    });
    // Reveal Observer
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (stickyRef.current) revealObserver.observe(stickyRef.current);
    blockRefs.current.forEach(block => {
        if (block) revealObserver.observe(block);
    });

    // Sticky Scroll Swapper
    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const newImg = entry.target.getAttribute('data-img');
          if (newImg) setActiveImg(newImg);
        }
      });
    }, { rootMargin: "-50% 0px -50% 0px" });

    blockRefs.current.forEach(block => {
        if (block) stickyObserver.observe(block);
    });

    return () => {
      revealObserver.disconnect();
      stickyObserver.disconnect();
    };
  }, []);

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-layout">
          <div className="features-sticky-col">
            <div className="sticky-container">
              <div className="sticky-frame reveal" ref={stickyRef}>
                <div className="sticky-watermark">01</div>
                {featureData.map(feat => (
                  <img
                    key={feat.id}
                    src={feat.img}
                    className="sticky-image"
                    style={{ opacity: activeImg === feat.img ? 1 : 0 }}
                    alt="Feature Graphic"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="features-scroll-col">
            {featureData.map((feat, index) => (
              <div 
                key={feat.id} 
                className={`feature-block reveal ${index === 1 ? 'bg-white' : ''}`}
                data-img={feat.img}
                ref={el => { blockRefs.current[index] = el; }}
              >
                <div className="feature-num">{feat.num}</div>
                <h2 className="feature-title">{feat.title}</h2>
                <p className="feature-desc">{feat.desc}</p>
                <a href="engineering" className="feature-link">Read Tech Specs →</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
