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
import './Navbar.css';

export default function Navbar({
  theme,
  setTheme,
  soundMuted,
  setSoundMuted,
  onOpenCommand,
  onToggleSettings,
  isSettingsOpen
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const pillRef = useRef(null);
  const navItemRefs = useRef({});
  const isClickScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef(null);

  // Dynamic indicator geometry state (Motion spring-driven for section underline)
  const [indicatorTarget, setIndicatorTarget] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 2,
    opacity: 0
  });

  // Enable fluid transitions after initial layout geometry has computed
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Calculate underline indicator coordinates dynamically for active nav items
  const updateIndicatorPosition = useCallback(() => {
    if (!pillRef.current) return;
    const pillRect = pillRef.current.getBoundingClientRect();
    const isMobileNavHidden = window.innerWidth <= 720;

    if (isMobileNavHidden || !activeSection || !navItemRefs.current[activeSection]) {
      setIndicatorTarget((prev) => ({
        ...prev,
        opacity: 0
      }));
      return;
    }

    const targetElement = navItemRefs.current[activeSection];
    const targetRect = targetElement.getBoundingClientRect();
    if (targetRect.width === 0 && targetRect.height === 0) return;

    // Underline directly beneath the active navigation item's text
    const width = Math.round(targetRect.width);
    const height = 2;
    const x = Math.round(targetRect.left - pillRect.left);
    const y = Math.round(targetRect.bottom - pillRect.top + 3);

    setIndicatorTarget({
      x,
      y,
      width,
      height,
      opacity: 1
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
        isClickScrollingRef.current = false;
        clearTimeout(scrollEndTimerRef.current);
        handleScroll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleUserScrollInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserScrollInterrupt, { passive: true });

    updateScrollSpy();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserScrollInterrupt);
      window.removeEventListener('touchmove', handleUserScrollInterrupt);
      clearTimeout(scrollEndTimerRef.current);
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

    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', targetId === 'top' ? '#' : `#${targetId}`);
    }

    clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollY <= 90) {
        setActiveSection('');
      } else if (scrollY + windowHeight >= docHeight - 50) {
        setActiveSection('contact');
      } else {
        const focusPoint = windowHeight * 0.33;
        const sections = ['work', 'experience', 'collection', 'contact'];
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= focusPoint && rect.bottom > focusPoint) {
              setActiveSection(id);
              break;
            }
          }
        }
      }
    }, 750);
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-pill" ref={pillRef}>
        {/* Animated Underline Indicator for Active Navigation Section */}
        <motion.div
          className="navbar-indicator is-underline"
          initial={false}
          animate={{
            x: indicatorTarget.x,
            y: indicatorTarget.y,
            width: indicatorTarget.width,
            height: indicatorTarget.height,
            opacity: indicatorTarget.opacity
          }}
          transition={
            shouldReduceMotion || !hasMounted
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 280,
                  damping: 28,
                  mass: 0.7,
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
          {/* Signature Accent Dot (rock-solid, zero drift or lag on scroll) */}
          <span className="navbar-brand-dot" aria-hidden="true" />
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
