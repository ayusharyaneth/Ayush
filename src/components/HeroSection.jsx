import React, { useState, useEffect } from 'react';
import {
  Calendar,
  BadgeCheck,
  Copy
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function HeroSection({ personal, onCopyEmail, onBookCall }) {
  // 1. Animated Verb Switcher (Rahul M style: "I build / design / scale products")
  const verbs = personal.verbList || ['build', 'design', 'scale', 'ship'];
  const [verbIndex, setVerbIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVerbIndex((prev) => (prev + 1) % verbs.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [verbs.length]);

  // 3. Avatar toggle / cycle state (Saurabh & Nikhil style)
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatarPhotos = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
  ];

  const handleAvatarClick = () => {
    sound.playClick();
    setAvatarIndex((prev) => (prev + 1) % avatarPhotos.length);
  };



  return (
    <section
      id="top"
      style={{
        paddingTop: '40px',
        paddingBottom: '48px',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Main Hero Card */}
        <div
          className="screen-box hero-card"
          style={{
            padding: '36px 32px'
          }}
        >
          <div>
              {/* Profile Bar with Dual Avatar Reveal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div
                  onClick={handleAvatarClick}
                  className="avatar-container"
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid var(--border-glow)',
                    boxShadow: 'var(--shadow-card)'
                  }}
                  title="Click to switch photo"
                >
                  {/* Photo 1 (Formal / Default) */}
                  <img
                    src={avatarPhotos[0]}
                    alt={personal.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      inset: 0,
                      opacity: avatarIndex === 0 ? 1 : 0,
                      transition: 'opacity 0.3s ease, transform 0.4s ease'
                    }}
                  />
                  {/* Photo 2 (Candid / Smiling) */}
                  <img
                    src={avatarPhotos[1]}
                    alt={`${personal.name} smiling`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      inset: 0,
                      opacity: avatarIndex === 1 ? 1 : 0,
                      transition: 'opacity 0.3s ease, transform 0.4s ease'
                    }}
                  />
                  {/* Click Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 6px var(--accent)'
                    }}
                  >
                    <span style={{ fontSize: '8px', color: '#000', fontWeight: 'bold' }}>✦</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h1
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {personal.name}
                    </h1>
                    <BadgeCheck size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {personal.title}
                  </div>
                </div>
              </div>

              {/* Dynamic Verb Switcher Headline (Rahul M style) */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.1rem, 4.5vw, 2.9rem)',
                    lineHeight: 1.15,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>I </span>
                  <span
                    style={{
                      display: 'inline-block',
                      color: 'var(--accent)',
                      textDecoration: 'underline',
                      textDecorationColor: 'var(--accent-tint)',
                      textUnderlineOffset: '6px',
                      minWidth: '130px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {verbs[verbIndex]}
                  </span>
                  <br />
                  <span>digital products.</span>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-family-serif)',
                    fontStyle: 'italic',
                    fontSize: '1.35rem',
                    color: 'var(--text-secondary)',
                    marginTop: '6px'
                  }}
                >
                  From zero to one.
                </div>
              </div>

              {/* Bio Paragraph */}
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  marginBottom: '24px',
                  maxWidth: '640px'
                }}
              >
                {personal.shortBio}
              </p>
            </div>

            {/* Availability Pill & Quick Action CTA */}
            <div>
              {/* Availability Indicator */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-tint)',
                  border: '1px solid var(--accent-border)',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  marginBottom: '20px'
                }}
              >
                <span className="pulsing-dot" />
                <span>{personal.statusText}</span>
              </div>

              {/* Primary Call-to-Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    sound.playClick();
                    onBookCall();
                  }}
                  className="btn-primary"
                >
                  <Calendar size={15} />
                  <span>Book an intro call</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onCopyEmail();
                  }}
                  className="btn-secondary"
                  title="Press C on keyboard to copy instantly"
                >
                  <Copy size={14} />
                  <span>Copy email</span>
                  <kbd className="kbd-chip" style={{ marginLeft: '4px' }}>
                    C
                  </kbd>
                </button>
              </div>
            </div>
          </div>
        </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-card {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

