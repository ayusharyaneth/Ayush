import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  LayoutGrid,
  Briefcase,
  Sparkles,
  Mail,
  Search,
  Sun,
  Moon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import './HoverRevealMenu.css';

export const defaultMenuItems = [
  { id: 'top', label: 'Home', href: '#top', icon: Home },
  { id: 'work', label: 'Projects', href: '#work', icon: LayoutGrid },
  { id: 'experience', label: 'Experience', href: '#experience', icon: Briefcase },
  { id: 'collection', label: 'Collection', href: '#collection', icon: Sparkles },
  { id: 'contact', label: 'Contact', href: '#contact', icon: Mail }
];

export default function HoverRevealMenu({
  items = defaultMenuItems,
  variant = 'floating', // 'floating' | 'inline'
  onOpenCommand,
  theme,
  setTheme,
  soundMuted,
  setSoundMuted,
  showTools = true
}) {
  const [activeId, setActiveId] = useState('top');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // ScrollSpy: Automatically detect which section is currently active
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const targetId = item.id === 'top' ? 'top' : item.id;
        const el = document.getElementById(targetId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveId(item.id);
            break;
          }
        }
      }

      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const handleItemClick = (e, item) => {
    e.preventDefault();
    sound.playClick();

    const targetEl = document.getElementById(item.id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    } else if (item.href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setActiveId(item.id);
  };

  const handleMouseEnter = () => {
    sound.playHover();
  };

  const toggleTheme = (e) => {
    e.preventDefault();
    sound.playToggle();
    if (setTheme) {
      setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }
  };

  const toggleSound = (e) => {
    e.preventDefault();
    if (setSoundMuted) {
      const isMuted = sound.toggleMute();
      setSoundMuted(isMuted);
      if (!isMuted) sound.playClick();
    }
  };

  const handleCommandOpen = (e) => {
    e.preventDefault();
    sound.playClick();
    if (onOpenCommand) onOpenCommand();
  };

  const menuContent = (
    <nav
      className={`hrm-wrapper ${variant === 'inline' ? 'hrm-variant-inline' : ''}`}
      aria-label="Hover reveal navigation"
    >
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeId === item.id;

        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => handleItemClick(e, item)}
            onMouseEnter={handleMouseEnter}
            className={`hrm-btn ${isActive ? 'hrm-active' : ''}`}
            aria-label={item.label}
            title={item.label}
          >
            <div className="hrm-icon">
              <IconComponent size={variant === 'inline' ? 14 : 17} />
            </div>
            <span className="hrm-text">{item.label}</span>
            {isActive && <span className="hrm-active-dot" />}
          </a>
        );
      })}

      {/* Floating dock action buttons (Search, Theme, Sound) */}
      {variant === 'floating' && showTools && (
        <>
          <div className="hrm-divider" />

          {onOpenCommand && (
            <button
              onClick={handleCommandOpen}
              onMouseEnter={handleMouseEnter}
              className="hrm-btn"
              title="Search / Command Palette (⌘K)"
              aria-label="Open command palette"
            >
              <div className="hrm-icon">
                <Search size={16} />
              </div>
              <span className="hrm-text">Search (⌘K)</span>
            </button>
          )}

          {setTheme && (
            <button
              onClick={toggleTheme}
              onMouseEnter={handleMouseEnter}
              className="hrm-btn"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode (D)`}
              aria-label="Toggle theme"
            >
              <div className="hrm-icon">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </div>
              <span className="hrm-text">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          )}

          {setSoundMuted && (
            <button
              onClick={toggleSound}
              onMouseEnter={handleMouseEnter}
              className="hrm-btn"
              title={soundMuted ? 'Unmute Interface Audio' : 'Mute Interface Audio'}
              aria-label="Toggle sound"
            >
              <div className="hrm-icon">
                {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </div>
              <span className="hrm-text">{soundMuted ? 'Audio Off' : 'Audio On'}</span>
            </button>
          )}
        </>
      )}
    </nav>
  );

  if (variant === 'inline') {
    return menuContent;
  }

  return (
    <aside
      className={`hrm-floating-container ${!isVisible ? 'hrm-hidden' : ''}`}
      aria-label="Floating hover reveal menu dock"
    >
      {menuContent}
    </aside>
  );
}
