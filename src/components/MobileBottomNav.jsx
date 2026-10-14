import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronUp,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/soundEffects';
import { smoothScrollTo } from '../utils/smoothScroll';
import './MobileBottomNav.css';

const NAV_ITEMS = [
  { id: 'top', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'collection', label: 'Collection' },
  { id: 'contact', label: 'Contact', hasArrow: false },
  { id: 'support', label: 'Support' }
];

export default function MobileBottomNav({ isCopiedActive = false, currentView = 'home', onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [scrollProgress, setScrollProgress] = useState(0);
  const isClickScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef(null);
  const menuContainerRef = useRef(null);

  const isMenuOpen = isOpen && !isCopiedActive;

  // Active section display label
  const effectiveActiveSection = currentView === 'support' ? 'support' : activeSection;
  const activeItem = NAV_ITEMS.find((item) => item.id === effectiveActiveSection) || NAV_ITEMS[0];
  const isAtTop = effectiveActiveSection === 'top';

  // Track scroll progress and active section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, docHeight - windowHeight);

      // Scroll progress ratio (0 to 1)
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      setScrollProgress(progress);

      // If user triggered navigation scroll, avoid fighting
      if (isClickScrollingRef.current) {
        ticking = false;
        return;
      }

      // 1. Top of page
      if (scrollY <= 90) {
        setActiveSection('top');
        ticking = false;
        return;
      }

      // 2. Bottom of page -> Contact
      if (scrollY + windowHeight >= docHeight - 50) {
        setActiveSection('contact');
        ticking = false;
        return;
      }

      // 3. Middle sections detection
      const focusPoint = windowHeight * 0.35;
      const sectionIds = ['work', 'experience', 'collection', 'contact'];
      let matched = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= focusPoint && rect.bottom > focusPoint) {
          matched = id;
          break;
        }
      }

      if (!matched) {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el && el.getBoundingClientRect().top <= focusPoint) {
            matched = sectionIds[i];
            break;
          }
        }
      }

      if (matched) {
        setActiveSection(matched);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(handleScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    const timerRef = scrollEndTimerRef;
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Dismiss menu on outside tap or touch
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = (e) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Scroll to section handler
  const handleSelectSection = useCallback((targetId) => {
    sound.playClick();
    setIsOpen(false);

    if (targetId === 'support') {
      onNavigate?.('support');
      return;
    }

    if (currentView === 'support') {
      onNavigate?.('home', targetId);
      return;
    }

    setActiveSection(targetId);
    isClickScrollingRef.current = true;

    smoothScrollTo(targetId, {
      onComplete: () => {
        isClickScrollingRef.current = false;
        setActiveSection(targetId);
      },
      onInterrupt: () => {
        isClickScrollingRef.current = false;
      }
    });

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', targetId === 'top' ? '#' : `#${targetId}`);
    }
  }, [currentView, onNavigate]);

  // Scroll to top button handler
  const handleScrollToTop = useCallback(() => {
    sound.playClick();
    setIsOpen(false);
    isClickScrollingRef.current = true;
    setActiveSection('top');

    smoothScrollTo('top', {
      onComplete: () => {
        isClickScrollingRef.current = false;
        setActiveSection('top');
      },
      onInterrupt: () => {
        isClickScrollingRef.current = false;
      }
    });

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#');
    }
  }, []);

  // Toggle expandable menu
  const handleToggleMenu = useCallback(() => {
    sound.playClick();
    setIsOpen((prev) => !prev);
  }, []);

  // SVG Progress circle calculations (radius = 12, circumference ~ 75.4)
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mobile-nav-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock Container */}
      <nav
        className="mobile-bottom-nav-root"
        aria-label="Mobile Bottom Navigation"
        ref={menuContainerRef}
      >
        {/* Expandable Menu Panel (Centered directly above pill) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              key="mobile-nav-panel"
              initial={{ opacity: 0, x: '-50%', y: 16, scale: 0.88, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: '-50%', y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: '-50%', y: 16, scale: 0.88, filter: 'blur(10px)' }}
              transition={{ type: 'spring', stiffness: 450, damping: 26, mass: 0.9 }}
              style={{ left: '50%', transformOrigin: 'bottom center' }}
              className="mobile-nav-menu-panel"
              role="menu"
            >
              <div className="mobile-nav-menu-header">
                <span className="mobile-nav-menu-header-label">Navigation</span>
                <span className="mobile-nav-menu-header-dot" />
              </div>

              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSection(item.id)}
                    className={`mobile-nav-menu-item ${isActive ? 'active' : ''}`}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="mobile-nav-menu-item-left">
                      {isActive ? (
                        <span className="mobile-nav-item-active-dot" />
                      ) : (
                        <span className="mobile-nav-item-inactive-bullet" />
                      )}
                      <span>{item.label}</span>
                    </div>

                    {item.hasArrow && (
                      <span className="mobile-nav-menu-item-badge">
                        <ArrowUpRight size={13} />
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dock Navigation Pill */}
        <div className="mobile-dock-row">
          <div className="mobile-nav-pill-wrapper">
            <div className="mobile-nav-pill">
              {/* Scroll Progress / Scroll To Top Circular Button */}
              <button
                onClick={handleScrollToTop}
                className="mobile-nav-progress-btn"
                aria-label="Scroll to top"
                title="Scroll to top"
              >
                <svg className="mobile-progress-svg" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="mobile-progress-track"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="mobile-progress-bar"
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: strokeDashoffset
                    }}
                  />
                </svg>

                {/* Center Indicator Icon: Dash if at top, Chevron-up if scrolled */}
                <span className="mobile-progress-icon">
                  {isAtTop ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  ) : (
                    <ChevronUp size={12} strokeWidth={2.8} />
                  )}
                </span>
              </button>

              {/* Section Name & Menu Trigger */}
              <button
                onClick={handleToggleMenu}
                className="mobile-nav-trigger-btn"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav-panel"
                aria-label={`Current section: ${activeItem.label}. Tap to open navigation menu.`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={activeItem.label}
                    initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.8 }}
                    className="mobile-nav-section-title"
                  >
                    {activeItem.label}
                  </motion.span>
                </AnimatePresence>

                <ChevronUp
                  size={14}
                  className={`mobile-nav-chevron ${isMenuOpen ? 'open' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
