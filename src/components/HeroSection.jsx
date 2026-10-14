import React, { useState, useEffect } from 'react';
import {
  Calendar,
  BadgeCheck,
  Copy,
  Lightbulb,
  MapPin,
  Mail,
  Clock,
  Phone
} from 'lucide-react';
import {
  TwitterIcon,
  GithubIcon,
  LinkedinIcon,
  FigmaIcon,
  DribbbleIcon,
  LeetCodeIcon
} from './Icons';
import { sound } from '../utils/soundEffects';
import './HeroSection.css';

export default function HeroSection({ personal, onCopyEmail, onBookCall }) {
  // Avatar toggle / cycle state (Opening Pic vs Clicked Pic)
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatarPhotos = [
    '/avatars/avatar-primary.png',
    '/avatars/avatar-secondary.png'
  ];

  const handleAvatarClick = () => {
    sound.playClick();
    setAvatarIndex((prev) => (prev + 1) % avatarPhotos.length);
  };

  // Live ticking clock for Asia/Ho_Chi_Minh timezone as shown in reference
  const [liveTime, setLiveTime] = useState(() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(new Date());
    } catch {
      return '11:13 PM';
    }
  });

  useEffect(() => {
    const updateTime = () => {
      try {
        setLiveTime(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }).format(new Date())
        );
      } catch {
        // preserve current
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const chanh = personal?.chanhCard || {
    role1: {
      title: 'Design Engineer',
      company: '@shadcncraft',
      url: 'https://github.com/shadcncraft'
    },
    role2: {
      title: 'Founder',
      company: '@Quaric',
      url: 'https://quaric.com'
    },
    location: 'Ho Chi Minh City, Viet Nam',
    email: 'dai@chanhdai.com',
    phone: '+84 777 888 148',
    phoneTel: '+84777888148',
    timeComment: '// 1h ahead',
    socials: {
      twitter: 'https://x.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      figma: 'https://figma.com/@ayusharyan',
      dribbble: 'https://dribbble.com/ayusharyan',
      leetcode: 'https://leetcode.com/ayusharyan_algo'
    }
  };

  const socialLinks = [
    { name: 'X / Twitter', icon: TwitterIcon, url: chanh.socials?.twitter || 'https://x.com' },
    { name: 'GitHub', icon: GithubIcon, url: chanh.socials?.github || 'https://github.com' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: chanh.socials?.linkedin || 'https://linkedin.com' },
    { name: 'Figma', icon: FigmaIcon, url: chanh.socials?.figma || 'https://figma.com/@ayusharyan' },
    { name: 'Dribbble', icon: DribbbleIcon, url: chanh.socials?.dribbble || 'https://dribbble.com/ayusharyan' },
    { name: 'LeetCode', icon: LeetCodeIcon, url: chanh.socials?.leetcode || 'https://leetcode.com/ayusharyan_algo' }
  ];

  return (
    <section
      id="top"
      style={{
        paddingTop: '24px',
        paddingBottom: '28px',
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
          {/* Profile Bar with Dual Avatar Reveal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
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
              {/* Photo 1 (Default / Opening Pic) */}
              <img
                src={avatarPhotos[0]}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://i.ibb.co/pB7wxbjb/bot-pfp-silver-star.png';
                }}
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
              {/* Photo 2 (Secondary / Clicked Pic) */}
              <img
                src={avatarPhotos[1]}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://i.ibb.co/RGszBkXG/bot-pfp-warm-pebble.png';
                }}
                alt={`${personal.name} avatar secondary`}
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

          {/* Chanh Dai Signature Hero Box */}
          <div className="chanh-hero-wrapper">
            {/* Top Social Row - Clean, clear background */}
            <div className="chanh-top-strip">
              {/* Handwritten "Follow Me" placed OUTSIDE the card dashed border, pointing directly at the first social button */}
              <div className="chanh-outside-connect">
                <span className="chanh-connect-text">Follow Me</span>
                <svg
                  width="56"
                  height="34"
                  viewBox="0 0 56 34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chanh-connect-arrow"
                  aria-hidden="true"
                >
                  <path d="M 6 4 C 6 16, 18 24, 48 24" />
                  <path d="M 40 18 L 48 24 L 40 30" />
                </svg>
              </div>

              <div className="chanh-social-row">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chanh-social-btn"
                      title={item.name}
                      onClick={() => sound.playClick()}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Information Grid */}
            <div className="chanh-info-grid">
              {/* Left Column */}
              <div className="chanh-grid-column">
                <div className="chanh-grid-item">
                  <span className="chanh-badge">&lt;/&gt;</span>
                  <div className="chanh-item-text">
                    <span>{chanh.role1.title}</span>
                    <a
                      href={chanh.role1.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chanh-handle"
                    >
                      {chanh.role1.company}
                    </a>
                  </div>
                </div>

                <div className="chanh-grid-item">
                  <span className="chanh-badge">
                    <Lightbulb size={13} />
                  </span>
                  <div className="chanh-item-text">
                    <span>{chanh.role2.title}</span>
                    <a
                      href={chanh.role2.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chanh-handle"
                    >
                      {chanh.role2.company}
                    </a>
                  </div>
                </div>

                <div className="chanh-grid-item">
                  <span className="chanh-badge">
                    <MapPin size={13} />
                  </span>
                  <div className="chanh-item-text">
                    <span>{chanh.location}</span>
                  </div>
                </div>

                <div className="chanh-grid-item">
                  <span className="chanh-badge">
                    <Mail size={13} />
                  </span>
                  <div className="chanh-item-text">
                    <a
                      href={`mailto:${chanh.email}`}
                      onClick={(e) => {
                        e.preventDefault();
                        sound.playClick();
                        onCopyEmail(chanh.email);
                      }}
                      className="chanh-link"
                      title="Click to copy email"
                    >
                      {chanh.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="chanh-grid-column right-col">
                <div className="chanh-grid-item">
                  <span className="chanh-badge">
                    <Clock size={13} />
                  </span>
                  <div className="chanh-item-text">
                    <span>{liveTime}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{chanh.timeComment}</span>
                  </div>
                </div>

                <div className="chanh-grid-item">
                  <span className="chanh-badge">
                    <Phone size={13} />
                  </span>
                  <div className="chanh-item-text">
                    <a href={`tel:${chanh.phoneTel}`} className="chanh-link">
                      {chanh.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Paragraph */}
          <p
            style={{
              fontSize: '0.92rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginBottom: '20px',
              maxWidth: '680px'
            }}
          >
            {personal.shortBio}
          </p>

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
                  onCopyEmail(personal.email);
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
