import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  Sliders,
  Moon,
  Sun,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { sound } from '../utils/soundEffects';
import { smoothScrollTo, cancelSmoothScroll } from '../utils/smoothScroll';
import './Navbar.css';

export default function Navbar({
  theme,
  setTheme,
  onOpenCommand,
  onToggleSettings,
  isSettingsOpen
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const pillRef = useRef(null);
  const logoDotAnchorRef = useRef(null);
  const navItemRefs = useRef({});
  const isClickScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef(null);

  // Dynamic indicator geometry state (Motion spring-driven dot-to-line morph)
  const [indicatorTarget, setIndicatorTarget] = useState({
    x: 0,
    y: 0,
    width: 7,
    height: 7,
    opacity: 0,
    isUnderline: false
  });

  // Enable fluid transitions after initial layout geometry has computed
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Calculate indicator coordinates dynamically using actual DOM rects
  const updateIndicatorPosition = useCallback(() => {
    if (!pillRef.current) return;
    const pillRect = pillRef.current.getBoundingClientRect();
    const isMobileNavHidden = window.innerWidth <= 720;

    let targetElement = null;
    let isUnderline = false;

    if (!isMobileNavHidden && activeSection && navItemRefs.current[activeSection]) {
      targetElement = navItemRefs.current[activeSection];
      isUnderline = true;
    } else if (logoDotAnchorRef.current) {
      targetElement = logoDotAnchorRef.current;
      isUnderline = false;
    }

    if (!targetElement) return;

    const targetRect = targetElement.getBoundingClientRect();
    if (targetRect.width === 0 && targetRect.height === 0) return;

    let x, y, width, height;

    if (isUnderline) {
      // Underline directly beneath the active navigation item's text
      width = Math.round(targetRect.width);
      height = 2;
      x = Math.round(targetRect.left - pillRect.left);
      y = Math.round(targetRect.bottom - pillRect.top + 3);
    } else {
      // Small glowing blue dot beside "Ayush Aryan" logo
      width = 7;
      height = 7;
      x = Math.round(targetRect.left - pillRect.left);
      y = Math.round(targetRect.top - pillRect.top + (targetRect.height - 7) / 2);
    }

    setIndicatorTarget({
      x,
      y,
      width,
      height,
      opacity: 1,
      isUnderline
    });
  }, [activeSection]);

  // Recalculate indicator position on section change or header morph
  useLayoutEffect(() => {
    updateIndicatorPosition();
    const timer = setTimeout(updateIndicatorPosition, 360);
    return () => clearTimeout(timer);
  }, [updateIndicatorPosition, isScrolled]);

  // ResizeObserver & window resize to keep coordinates pixel-perfect
  useEffect(() => {
    if (!pillRef.current) return;

    const ro = new ResizeObserver(() => {
      updateIndicatorPosition();
    });
    ro.observe(pillRef.current);

    const handleResize = () => {
      updateIndicatorPosition();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        updateIndicatorPosition();
      });
    }

    const rafId = requestAnimationFrame(() => {
      updateIndicatorPosition();
    });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [updateIndicatorPosition]);

  // Active section detection during manual scrolling
  useEffect(() => {
    let ticking = false;

    const updateScrollSpy = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Header morphs to floating pill once scrolled past 25px
      setIsScrolled(scrollY > 25);

      // Prevent fighting with smooth scroll when user clicked a nav link
      if (isClickScrollingRef.current) {
        ticking = false;
        return;
      }

      // Return to logo dot when effectively at the top of the page
      if (scrollY <= 90) {
        setActiveSection('');
        ticking = false;
        return;
      }

      // Ensure Contact section works reliably at bottom of page
      if (scrollY + windowHeight >= docHeight - 50) {
        setActiveSection('contact');
        ticking = false;
        return;
      }

      // Focus point roughly 33% from viewport top
      const focusPoint = windowHeight * 0.33;
      const sections = ['work', 'experience', 'collection', 'contact'];

      let detected = '';

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= focusPoint && rect.bottom > focusPoint) {
          detected = id;
          break;
        }
      }

      if (!detected) {
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.getBoundingClientRect().top <= focusPoint) {
            detected = sections[i];
            break;
          }
        }
      }

      setActiveSection(detected);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollSpy);
      }
    };

    const handleUserScrollInterrupt = () => {
      if (isClickScrollingRef.current) {
        cancelSmoothScroll();
        isClickScrollingRef.current = false;
        clearTimeout(scrollEndTimerRef.current);
        handleScroll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleUserScrollInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserScrollInterrupt, { passive: true });

    updateScrollSpy();

    const timerRef = scrollEndTimerRef;
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserScrollInterrupt);
      window.removeEventListener('touchmove', handleUserScrollInterrupt);
      if (timerRef.current) clearTimeout(timerRef.current);
      cancelSmoothScroll();
    };
  }, []);

  const toggleTheme = () => {
    sound.playToggle();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    sound.playClick();

    const targetSection = targetId === 'top' ? '' : targetId;
    setActiveSection(targetSection);

    // Lock scroll spy during smooth scroll to prevent intermediate indicator jumping
    isClickScrollingRef.current = true;

    smoothScrollTo(targetId, {
      onComplete: () => {
        isClickScrollingRef.current = false;
        setActiveSection(targetSection);
      },
      onInterrupt: () => {
        isClickScrollingRef.current = false;
      }
    });

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', targetId === 'top' ? '#' : `#${targetId}`);
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-pill" ref={pillRef}>
        {/* Single Shared Animated Indicator (Dot-to-Line morphing driven by Framer Motion) */}
        <motion.div
          className={`navbar-indicator ${indicatorTarget.isUnderline ? 'is-underline' : 'is-dot'}`}
          initial={false}
          animate={{
            x: indicatorTarget.x,
            y: indicatorTarget.y,
            width: indicatorTarget.width,
            height: indicatorTarget.height,
            opacity: indicatorTarget.opacity,
            borderRadius: indicatorTarget.isUnderline ? '2px' : '9999px'
          }}
          transition={
            shouldReduceMotion || !hasMounted
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 280,
                  damping: 26,
                  mass: 0.65,
                  restDelta: 0.001
                }
          }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            backgroundColor: 'var(--accent)',
            zIndex: 10
          }}
          aria-hidden="true"
        />

        {/* Brand Monogram */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, 'top')}
          className="navbar-brand"
          title="Ayush Aryan Portfolio"
        >
          <span>Ayush</span>
          <span style={{ color: 'var(--accent)' }}>Aryan</span>
          {/* Spatial Anchor for the morphing indicator dot */}
          <span
            ref={logoDotAnchorRef}
            className="navbar-brand-dot-anchor"
            aria-hidden="true"
          />
        </a>

        {/* Section Navigation Links */}
        <nav className="navbar-nav">
          <a
            href="#work"
            onClick={(e) => handleNavClick(e, 'work')}
            onMouseEnter={() => sound.playHover()}
            className={`navbar-link ${activeSection === 'work' ? 'active' : ''}`}
          >
            <span
              ref={(el) => (navItemRefs.current['work'] = el)}
              className="navbar-link-text"
            >
              Work
            </span>
          </a>
          <a
            href="#experience"
            onClick={(e) => handleNavClick(e, 'experience')}
            onMouseEnter={() => sound.playHover()}
            className={`navbar-link ${activeSection === 'experience' ? 'active' : ''}`}
          >
            <span
              ref={(el) => (navItemRefs.current['experience'] = el)}
              className="navbar-link-text"
            >
              Experience
            </span>
          </a>
          <a
            href="#collection"
            onClick={(e) => handleNavClick(e, 'collection')}
            onMouseEnter={() => sound.playHover()}
            className={`navbar-link ${activeSection === 'collection' ? 'active' : ''}`}
          >
            <span
              ref={(el) => (navItemRefs.current['collection'] = el)}
              className="navbar-link-text"
            >
              The Collection
            </span>
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            onMouseEnter={() => sound.playHover()}
            className={`navbar-link ${activeSection === 'contact' ? 'active' : ''}`}
          >
            <span
              ref={(el) => (navItemRefs.current['contact'] = el)}
              className="navbar-link-text"
            >
              Contact
            </span>
            <ArrowUpRight size={13} style={{ opacity: 0.8, flexShrink: 0 }} />
          </a>
        </nav>

        {/* Divider 2 (Preserved between nav and actions) */}
        <div className="navbar-divider" />

        {/* Action Controls & Triggers */}
        <div className="navbar-actions">
          {/* Search Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCommand();
            }}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Search (⌘K)"
            aria-label="Search"
          >
            <Search size={15} />
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode (D)`}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Interface Customizer Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSettings();
            }}
            className="btn-icon"
            style={{
              width: '32px',
              height: '32px',
              background: isSettingsOpen ? 'var(--accent-tint)' : 'var(--bg-muted)',
              borderColor: isSettingsOpen ? 'var(--accent-border)' : 'var(--border-secondary)',
              color: isSettingsOpen ? 'var(--accent)' : 'inherit'
            }}
            title="Open interface customizer"
            aria-label="Settings"
          >
            <Sliders size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
