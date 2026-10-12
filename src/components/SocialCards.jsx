import React, { useState } from 'react';
import { Mail, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon, LeetCodeIcon } from './Icons';
import { sound } from '../utils/soundEffects';

export default function SocialCards({ socials = [], email = '' }) {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'github':
        return GithubIcon;
      case 'twitter / x':
      case 'twitter':
        return TwitterIcon;
      case 'linkedin':
        return LinkedinIcon;
      case 'leetcode':
        return LeetCodeIcon;
      default:
        return ExternalLink;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        position: 'relative'
      }}
    >
      {socials.map((social) => {
        const Icon = getIcon(social.name);
        const isHovered = hoveredSocial === social.name;

        return (
          <div
            key={social.name}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredSocial(social.name)}
            onMouseLeave={() => setHoveredSocial(null)}
          >
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              className="btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                gap: '7px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Icon size={14} style={{ color: 'var(--accent)' }} />
              <span>{social.name}</span>
            </a>

            {/* Rich Hover Popover Card (Vikrant Kadam style) */}
            {isHovered && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '260px',
                  zIndex: 70,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-popover)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  padding: '12px 14px',
                  pointerEvents: 'none',
                  animation: 'slideUpFade 0.2s var(--ease-spring)'
                }}
              >
                {/* Header with Icon & Username */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-tint)',
                      border: '1px solid var(--accent-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)'
                    }}
                  >
                    <Icon size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {social.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-family-mono)', color: 'var(--text-muted)' }}>
                      {social.username}
                    </div>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '8px' }}>
                  {social.bio}
                </p>

                {/* Metric Badges */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '6px',
                    borderTop: '1px solid var(--border-secondary)',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-family-mono)'
                  }}
                >
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{social.stats.primary}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{social.stats.secondary}</span>
                </div>

                {/* Bottom Pointer Arrow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid var(--border-glow)'
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
