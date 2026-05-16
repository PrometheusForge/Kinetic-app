"use client";
import React, { useEffect, useRef, useState } from 'react';

const featureData = [
  { id: 1, img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop', num: '01', title: 'Naked Portafilter.', desc: 'Watch the extraction happen in real time. The 58mm commercial-grade naked portafilter ensures perfect channeling visibility.' },
  { id: 2, img: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?q=80&w=800&auto=format&fit=crop', num: '02', title: 'Kinetic Lever.', desc: 'Our patented compound-leverage system translates 10lbs of human force into a flawless 9-bar pressure curve.' },
  { id: 3, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop', num: '03', title: 'Thermal Mass.', desc: 'Weighing 18lbs, the solid brass brew head retains boiling water temperatures with absolute stability throughout the pull.' }
];

export default function Features() {
  const [activeImg, setActiveImg] = useState(featureData[0].img);
  
  // Ref to securely track the active image inside the observer
  const activeImgRef = useRef(featureData[0].img); 
  
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // Sticky Scroll Swapper (Instant, Glitch-Free)
    const stickyObserver = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // Find the element most centered on the screen during fast scrolls
        const dominantEntry = visibleEntries.reduce((prev, current) => {
          return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
        });

        const newImg = dominantEntry.target.getAttribute('data-img');
        
        // Instantly update state if the image is new
        if (newImg && newImg !== activeImgRef.current) {
          activeImgRef.current = newImg;
          setActiveImg(newImg); 
        }
      }
    }, { 
      rootMargin: "-45% 0px -45% 0px", 
      threshold: 0 
    });

    blockRefs.current.forEach(block => {
        if (block) stickyObserver.observe(block);
    });

    return () => {
      revealObserver.disconnect();
      stickyObserver.disconnect();
    };
  }, []);

  // Dynamically update the watermark number based on the active image
  const activeFeature = featureData.find(f => f.img === activeImg);

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-layout">
          
          <div className="features-sticky-col">
            <div className="sticky-container">
              <div className="sticky-frame reveal" ref={stickyRef}>
                
                <div className="sticky-watermark">{activeFeature?.num || '01'}</div>
                
                {featureData.map((feat) => (
                  <img 
                    key={feat.id}
                    src={feat.img} 
                    className="sticky-image" 
                    alt={feat.title} 
                    loading="eager"        // Forces browser to download immediately
                    fetchPriority="high"   // Tells the browser not to delay this asset
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 1, // NEVER let the opacity drop to 0
                      zIndex: activeImg === feat.img ? 10 : 1, // Bring active image to the top
                      transition: 'none',
                      pointerEvents: activeImg === feat.img ? 'auto' : 'none'
                    }}
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
