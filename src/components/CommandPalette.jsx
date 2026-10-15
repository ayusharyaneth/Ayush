import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FolderGit2,
  Briefcase,
  Layers,
  Mail,
  Calendar,
  FileText,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Heart
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { smoothScrollTo } from '../utils/smoothScroll';

export default function CommandPalette({
  isOpen,
  setIsOpen,
  onCopyEmail,
  theme,
  setTheme,
  soundMuted,
  setSoundMuted,
  projects = [],
  onOpenCaseStudy,
  onNavigate
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }

  useEffect(() => {
    if (isOpen) {
      sound.playPop();
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const actions = [
    {
      category: 'Navigation',
      id: 'nav-work',
      title: 'Jump to Featured Work',
      subtitle: 'Browse 5 production case studies',
      icon: FolderGit2,
      run: () => {
        if (onNavigate) {
          onNavigate('home', 'work');
        } else {
          smoothScrollTo('work');
        }
        setIsOpen(false);
      }
    },
    {
      category: 'Navigation',
      id: 'nav-exp',
      title: 'Jump to Experience & GitHub',
      subtitle: 'Career timeline & 52-week activity heatmap',
      icon: Briefcase,
      run: () => {
        if (onNavigate) {
          onNavigate('home', 'experience');
        } else {
          smoothScrollTo('experience');
        }
        setIsOpen(false);
      }
    },
    {
      category: 'Navigation',
      id: 'nav-collection',
      title: 'Jump to Collection',
      subtitle: 'Security research, honors & publications',
      icon: Layers,
      run: () => {
        if (onNavigate) {
          onNavigate('home', 'collection');
        } else {
          smoothScrollTo('collection');
        }
        setIsOpen(false);
      }
    },
    {
      category: 'Navigation',
      id: 'nav-contact',
      title: 'Jump to Contact',
      subtitle: 'Send an inquiry or book an intro call',
      icon: Mail,
      run: () => {
        if (onNavigate) {
          onNavigate('home', 'contact');
        } else {
          smoothScrollTo('contact');
        }
        setIsOpen(false);
      }
    },
    {
      category: 'Navigation',
      id: 'nav-support',
      title: 'Jump to Support // Buy Me a Coffee',
      subtitle: 'PayPal, Buy Me a Coffee & Crypto transfers',
      icon: Heart,
      run: () => {
        onNavigate?.('support');
        setIsOpen(false);
      }
    },
    {
      category: 'Quick Actions',
      id: 'action-copy',
      title: 'Copy Email Address',
      subtitle: 'ayush@ayusharyan.dev',
      shortcut: 'C',
      icon: Mail,
      run: () => {
        onCopyEmail();
        setIsOpen(false);
      }
    },
    {
      category: 'Quick Actions',
      id: 'action-cal',
      title: 'Book a 15-min Call',
      subtitle: 'Schedule directly via Cal.com',
      icon: Calendar,
      run: () => {
        window.open('https://cal.com', '_blank');
        setIsOpen(false);
      }
    },
    {
      category: 'Quick Actions',
      id: 'action-resume',
      title: 'View Engineering Resume',
      subtitle: 'PDF summary of achievements & stack',
      icon: FileText,
      run: () => {
        window.open('#resume', '_self');
        setIsOpen(false);
      }
    },
    {
      category: 'Preferences',
      id: 'pref-theme',
      title: `Toggle Theme (${theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})`,
      subtitle: 'Change global color appearance',
      shortcut: 'D',
      icon: theme === 'dark' ? Sun : Moon,
      run: () => {
        sound.playToggle();
        setTheme(theme === 'dark' ? 'light' : 'dark');
        setIsOpen(false);
      }
    },
    {
      category: 'Preferences',
      id: 'pref-sound',
      title: soundMuted ? 'Enable Interface Audio' : 'Mute Interface Audio',
      subtitle: 'Haptic audio synthesis',
      shortcut: 'M',
      icon: soundMuted ? Volume2 : VolumeX,
      run: () => {
        const isMuted = sound.toggleMute();
        setSoundMuted(isMuted);
        if (!isMuted) sound.playClick();
        setIsOpen(false);
      }
    }
  ];

  // Add project search results
  const projectActions = projects.map((p) => ({
    category: 'Projects',
    id: `project-${p.id}`,
    title: p.title,
    subtitle: `${p.tagline} · ${p.technologies.slice(0, 3).join(', ')}`,
    icon: FolderGit2,
    run: () => {
      onOpenCaseStudy(p);
      setIsOpen(false);
    }
  }));

  const allItems = [...actions, ...projectActions];

  const filtered = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      sound.playClick();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      sound.playClick();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].run();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px 16px 24px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-popover)',
          overflow: 'hidden',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          animation: 'slideUpFade 0.2s var(--ease-spring)'
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-primary)'
          }}
        >
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search projects, skills..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontFamily: 'inherit'
            }}
          />
          <kbd className="kbd-chip" style={{ fontSize: '0.7rem' }}>
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div data-lenis-prevent style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }} className="scroll-fade-effect-y">
          {filtered.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => item.run()}
                  onMouseEnter={() => {
                    sound.playHover();
                    setSelectedIndex(idx);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--accent-tint)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--accent-border)' : 'transparent'}`,
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-muted)',
                      border: '1px solid var(--border-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                  {item.shortcut && <kbd className="kbd-chip">{item.shortcut}</kbd>}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderTop: '1px solid var(--border-secondary)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-muted)'
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
