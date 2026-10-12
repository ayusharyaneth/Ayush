import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  BadgeCheck
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function HeroSection({ personal, onCopyEmail, onBookCall }) {
  // 1. Dynamic Greeting based on visitor's current hour
  const [greeting, setGreeting] = useState('Hello');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good Evening Dear');
  }, []);

  // 2. Animated Verb Switcher (Rahul M style: "I build / design / scale products")
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
        {/* Schematic Top Meta Header */}
        <div
          className="screen-line-bottom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '14px',
            marginBottom: '28px',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-family-mono)',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent)' }}>●</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{greeting}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>LOC: {personal.location}</span>
          </div>
        </div>

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
                  maxWidth: '520px'
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

          {/* Right Column: Interactive 3D Canvas, Clock & Live Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 3D Interactive Canvas Widget */}
            <div className="screen-box" style={{ padding: '4px', overflow: 'hidden' }}>
              <InteractiveCanvas />
            </div>

            {/* Timezone & Clock Widget Card (Isolated for performance) */}
            <LiveClockWidget timeZone={personal.timeZone} location={personal.location} />

            {/* Quick Metrics Bar (hiartem.com deal/impact metrics) */}
            <div
              className="screen-box"
              style={{
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px'
              }}
            >
              {personal.stats.slice(0, 2).map((stat, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 780px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function LiveClockWidget({ timeZone, location }) {
  const [localTime, setLocalTime] = useState('');
  const [timeDiffText, setTimeDiffText] = useState('');
  const [clockDegrees, setClockDegrees] = useState({ hour: 0, minute: 0, second: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: timeZone || 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setLocalTime(formatter.format(now));

      const targetDate = new Date(now.toLocaleString('en-US', { timeZone: timeZone || 'Asia/Kolkata' }));
      const s = targetDate.getSeconds();
      const m = targetDate.getMinutes() + s / 60;
      const h = (targetDate.getHours() % 12) + m / 60;

      setClockDegrees({
        hour: (h / 12) * 360,
        minute: (m / 60) * 360,
        second: (s / 60) * 360
      });

      const diffMin = Math.round((targetDate.getTime() - now.getTime()) / (1000 * 60));
      const diffHours = Math.round(diffMin / 60);

      if (diffHours === 0) {
        setTimeDiffText('// same timezone as you');
      } else if (diffHours > 0) {
        setTimeDiffText(`// ${diffHours}h ahead of you`);
      } else {
        setTimeDiffText(`// ${Math.abs(diffHours)}h behind you`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  return (
    <div
      className="screen-box"
      style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <svg
          width="38"
          height="38"
          viewBox="0 0 40 40"
          style={{ flexShrink: 0 }}
          aria-label="Analog local clock"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="var(--bg-muted)"
            stroke="var(--border-line)"
            strokeWidth="1.5"
          />
          <line
            x1="20"
            y1="20"
            x2={20 + 8 * Math.sin((clockDegrees.hour * Math.PI) / 180)}
            y2={20 - 8 * Math.cos((clockDegrees.hour * Math.PI) / 180)}
            stroke="var(--text-primary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="20"
            x2={20 + 12 * Math.sin((clockDegrees.minute * Math.PI) / 180)}
            y2={20 - 12 * Math.cos((clockDegrees.minute * Math.PI) / 180)}
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="1.8" fill="var(--text-primary)" />
        </svg>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          >
            {localTime || 'Loading time...'}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}
          >
            {location} <span style={{ color: 'var(--accent)' }}>{timeDiffText}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          textAlign: 'right'
        }}
      >
        PST / UTC-7
      </div>
    </div>
  );
}

