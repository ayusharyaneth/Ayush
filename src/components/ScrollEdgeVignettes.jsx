import React, { useState, useEffect } from 'react';
import './ScrollEdgeVignettes.css';

/**
 * ScrollEdgeVignettes
 * 
 * Provides subtle, restrained, progressive blur and soft gradient edge transitions
 * at the top and bottom edges of the viewport during scrolling.
 * 
 * - Top blur: Fades in smoothly as user scrolls past hero content; fades out at page top.
 * - Bottom blur: Softly dissolves incoming content at the bottom of the viewport;
 *   smoothly fades away as the user reaches the footer so final content remains razor-sharp.
 * - Always pointer-events: none and sits beneath navigation controls (z-index: 75).
 */
export default function ScrollEdgeVignettes() {
  const [topOpacity, setTopOpacity] = useState(0);
  const [bottomOpacity, setBottomOpacity] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateVignettes = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, docHeight - windowHeight);

      // Top Edge Blur:
      // When at top (scrollY <= 6px): 0 opacity (hero is 100% sharp and unblurred)
      // As user scrolls down past 6px to 60px: smoothly rises to 1.0
      let nextTopOpacity = 0;
      if (scrollY > 6) {
        nextTopOpacity = Math.min(1, (scrollY - 6) / 54);
      }

      // Bottom Edge Blur:
      // If page has no scroll or is extremely short: 0 opacity
      // While scrolling through content: ~0.9 opacity (softens the bottom edge cutoff)
      // When approaching the footer (within last 320px down to 20px): smoothly eases to 0
      // so copyright, footer branding, and social buttons remain crystal clear
      let nextBottomOpacity = 0;
      if (maxScroll > 120) {
        const distFromBottom = maxScroll - scrollY;
        if (distFromBottom > 320) {
          nextBottomOpacity = 0.9;
        } else if (distFromBottom > 20) {
          nextBottomOpacity = ((distFromBottom - 20) / 300) * 0.9;
        } else {
          nextBottomOpacity = 0;
        }
      }

      setTopOpacity(Number(nextTopOpacity.toFixed(3)));
      setBottomOpacity(Number(nextBottomOpacity.toFixed(3)));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateVignettes);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateVignettes();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Top Edge Subtle Blur & Soft Fade */}
      <div
        className="scroll-vignette-top"
        style={{ opacity: topOpacity }}
        aria-hidden="true"
      />

      {/* Bottom Edge Subtle Blur & Soft Fade */}
      <div
        className="scroll-vignette-bottom"
        style={{ opacity: bottomOpacity }}
        aria-hidden="true"
      />
    </>
  );
}
