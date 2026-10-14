import React, { useEffect, useRef } from 'react';
import './GlowCard.css';

/**
 * GlowCardGrid
 * Reference: https://chanhdai.com/components/glow-card-grid
 * 
 * Tracks pointer coordinates relative to each card in the grid and sets
 * --pointer-x and --pointer-y CSS custom properties for ambient image glow
 * and illuminated refractive borders.
 */
export function GlowCardGrid({
  cardRadius = 16,
  iconBlur = 32,
  iconSaturate = 4.5,
  iconBrightness = 1.35,
  iconScale = 3.5,
  iconOpacity = 0.35,
  borderWidth = 2,
  borderBlur = 10,
  borderSaturate = 4.2,
  borderBrightness = 2.2,
  borderContrast = 2.2,
  className = '',
  style = {},
  children,
  ...props
}) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animationFrameId = null;
    let latestEvent = null;

    const updateCards = () => {
      if (!gridRef.current || !latestEvent) return;

      const cards = gridRef.current.querySelectorAll('[data-slot="glow-card"]');
      const clientX = latestEvent.clientX;
      const clientY = latestEvent.clientY;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();

        // Skip cards outside the visible viewport buffer for performance
        if (
          rect.bottom < -100 ||
          rect.top > windowHeight + 100 ||
          rect.right < -100 ||
          rect.left > windowWidth + 100
        ) {
          return;
        }

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (clientX - centerX) / (rect.width / 2);
        const y = (clientY - centerY) / (rect.height / 2);

        card.style.setProperty('--pointer-x', x.toFixed(3));
        card.style.setProperty('--pointer-y', y.toFixed(3));
      });

      animationFrameId = null;
    };

    const handlePointerMove = (event) => {
      latestEvent = event;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateCards);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const combinedStyle = {
    '--card-radius': `${cardRadius}px`,
    '--card-icon-blur': `${iconBlur}px`,
    '--card-icon-saturate': iconSaturate,
    '--card-icon-brightness': iconBrightness,
    '--card-icon-scale': iconScale,
    '--card-icon-opacity': iconOpacity,
    '--card-border-width': `${borderWidth}px`,
    '--card-border-blur': `${borderBlur}px`,
    '--card-border-saturate': borderSaturate,
    '--card-border-brightness': borderBrightness,
    '--card-border-contrast': borderContrast,
    ...style
  };

  return (
    <div
      ref={gridRef}
      className={`glow-card-grid ${className}`}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * GlowCardOverlay
 * 
 * Renders the layered optical effects inside a card:
 * 1. Ambient projected image reflection that tracks pointer offset
 * 2. Radial spotlight fill centered at pointer
 * 3. Chánh Đại's refractive mask-composite luminous border
 */
export function GlowCardOverlay({ image, title }) {
  return (
    <>
      {/* 1. Ambient Projected Artwork Glow */}
      {image && (
        <div className="glow-card-ambient-wrapper" aria-hidden="true">
          <div className="glow-card-ambient-img">
            <img src={image} alt={title || 'Ambient glow'} />
          </div>
        </div>
      )}

      {/* 2. Interactive Spotlight Fill */}
      <div className="glow-card-spotlight" aria-hidden="true" />

      {/* 3. Luminous Refractive Border Sheen */}
      <div className="glow-card-border-glow" aria-hidden="true" />
    </>
  );
}

export default GlowCardGrid;
