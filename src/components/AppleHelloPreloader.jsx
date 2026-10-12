import React, { useState, useEffect } from 'react';
import AppleHelloEffectEnglish from './AppleHelloEffectEnglish';
import { sound } from '../utils/soundEffects';
import './AppleHelloPreloader.css';

/**
 * AppleHelloPreloader
 * Full-screen preloader featuring the Apple English "hello" handwriting SVG animation.
 * Only displays English "hello" and smoothly fades out once complete.
 */
export default function AppleHelloPreloader({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const dismiss = () => {
    if (isExiting || isComplete) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsComplete(true);
      if (onFinish) onFinish();
    }, 600);
  };

  const handleAnimationComplete = () => {
    // Brief pause to admire the completed "hello"
    setTimeout(() => {
      dismiss();
    }, 450);
  };

  // Keyboard shortcut (Escape, Space, Enter) to dismiss instantly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isComplete) return null;

  return (
    <div
      className={`apple-preloader-overlay ${isExiting ? 'fade-out' : ''}`}
      onClick={dismiss}
      role="progressbar"
      aria-label="Loading site"
      aria-live="polite"
    >
      <div className="apple-preloader-container" onClick={(e) => e.stopPropagation()}>
        <div className="apple-preloader-glow" />
        <AppleHelloEffectEnglish
          durationScale={0.88}
          onAnimationComplete={handleAnimationComplete}
        />
      </div>

      <span className="apple-preloader-skip">Click anywhere to skip</span>
    </div>
  );
}
