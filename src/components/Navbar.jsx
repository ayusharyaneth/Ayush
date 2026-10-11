import React from 'react';
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

export default function Navbar({
  theme,
  setTheme,
  soundMuted,
  setSoundMuted,
  onOpenCommand,
  onToggleSettings,
  isSettingsOpen
}) {
  const toggleTheme = () => {
    sound.playToggle();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setSoundMuted(isMuted);
    if (!isMuted) sound.playClick();
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 80,
        width: '100%',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px dashed var(--border-dashed)',
        transition: 'background var(--duration-normal) var(--ease-smooth)'
      }}
    >
      <div
        className="container"
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand Monogram & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="#top"
            onClick={() => sound.playClick()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}
          >
            <span>alex</span>
            <span style={{ color: 'var(--accent)' }}>rivera.</span>
          </a>

          {/* Online Radar Badge (Vikrant Kadam style) */}
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

        {/* Section Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '0.84rem',
            color: 'var(--text-secondary)'
          }}
          className="nav-links"
        >
          <a
            href="#work"
            onClick={() => sound.playClick()}
            style={{ transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Work
          </a>
          <a
            href="#experience"
            onClick={() => sound.playClick()}
            style={{ transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Experience
          </a>
          <a
            href="#collection"
            onClick={() => sound.playClick()}
            style={{ transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            The Collection
          </a>
          <a
            href="#contact"
            onClick={() => sound.playClick()}
            style={{ transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Contact ↗
          </a>
        </nav>

        {/* Action Controls & Triggers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

      <style>{`
        @media (max-width: 680px) {
          .nav-links {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
