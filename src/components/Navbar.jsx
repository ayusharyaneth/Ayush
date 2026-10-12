import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Search,
  ArrowUpRight
} from 'lucide-react';
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

  // Scroll listener: morphs to floating pill on scroll and tracks active section (throttled via rAF)
  useEffect(() => {
    let ticking = false;

    const updateScrollSpy = () => {
      const scrollY = window.scrollY;
      
      // Trigger floating dock pill mode once scrolled past 25px
      setIsScrolled(scrollY > 25);

      if (scrollY < 180) {
        setActiveSection('');
        ticking = false;
        return;
      }

      const sections = [
        { id: 'contact', offset: 280 },
        { id: 'collection', offset: 280 },
        { id: 'experience', offset: 280 },
        { id: 'work', offset: 280 }
      ];

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && scrollY + section.offset >= el.offsetTop) {
          setActiveSection(section.id);
          ticking = false;
          return;
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollSpy);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollSpy();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    sound.playToggle();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setSoundMuted(isMuted);
    if (!isMuted) sound.playClick();
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    sound.playClick();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-pill">
        {/* Brand Monogram & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, 'top')}
            className="navbar-brand"
            title="Ayush Aryan Portfolio"
          >
            <span>ayush</span>
            <span style={{ color: 'var(--accent)' }}>aryan.</span>
          </a>

          {/* Online Radar Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-muted)',
              border: '1px solid var(--border-secondary)',
              fontSize: '0.68rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family-mono)'
            }}
            title="Active portfolio session"
          >
            <span className="pulsing-dot" />
            <span style={{ fontWeight: 500 }}>online</span>
          </div>
        </div>

        {/* Divider 1 */}
        <div className="navbar-divider" />

        {/* Section Navigation Links */}
        <nav className="navbar-nav">
          <a
            href="#work"
            onClick={(e) => handleNavClick(e, 'work')}
            onMouseEnter={() => sound.playHover()}
            className={`navbar-link ${activeSection === 'work' ? 'active' : ''}`}
          >
            Work
            {activeSection === 'work' && <span className="navbar-link-dot" />}
          </a>
          <a
            href="#experience"
            onClick={(e) => handleNavClick(e, 'experience')}
            onMouseEnter={() => sound.playHover()}
            className={`navbar-link ${activeSection === 'experience' ? 'active' : ''}`}
          >
            Experience
            {activeSection === 'experience' && <span className="navbar-link-dot" />}
          </a>
          <a
            href="#collection"
            onClick={(e) => handleNavClick(e, 'collection')}
            onMouseEnter={() => sound.playHover()}
            className={`navbar-link ${activeSection === 'collection' ? 'active' : ''}`}
          >
            The Collection
            {activeSection === 'collection' && <span className="navbar-link-dot" />}
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            onMouseEnter={() => sound.playHover()}
            className={`navbar-link ${activeSection === 'contact' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}
          >
            Contact
            <ArrowUpRight size={13} style={{ opacity: 0.8 }} />
            {activeSection === 'contact' && <span className="navbar-link-dot" />}
          </a>
        </nav>

        {/* Divider 2 */}
        <div className="navbar-divider" />

        {/* Action Controls & Triggers */}
        <div className="navbar-actions">
          {/* Command Palette Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCommand();
            }}
            className="btn-secondary"
            style={{
              padding: '5px 10px',
              fontSize: '0.78rem',
              gap: '6px',
              height: '32px'
            }}
            title="Open command palette (⌘K)"
          >
            <Search size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <kbd className="kbd-chip">⌘</kbd>
              <kbd className="kbd-chip">K</kbd>
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title={soundMuted ? 'Unmute interface audio' : 'Mute interface audio'}
            aria-label="Toggle sound"
          >
            {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} style={{ color: 'var(--accent)' }} />}
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
              borderColor: isSettingsOpen ? 'var(--accent)' : 'var(--border-secondary)',
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
