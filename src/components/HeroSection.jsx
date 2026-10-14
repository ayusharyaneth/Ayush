import React, { useState, useEffect, useRef } from 'react';
import {
  BadgeCheck,
  Copy,
  Check,
  Lightbulb,
  MapPin,
  Mail
} from 'lucide-react';
import {
  TwitterIcon,
  GithubIcon,
  LinkedinIcon,
  FigmaIcon,
  DribbbleIcon,
  BuyMeACoffeeIcon
} from './Icons';
import { sound } from '../utils/soundEffects';
import { haptic } from '../utils/haptic';
import { ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';
import './HeroSection.css';

export default function HeroSection({ personal, onCopyEmail }) {
  // Avatar toggle / cycle state (Opening Pic vs Clicked Pic)
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatarPhotos = [
    '/avatars/avatar-primary.png',
    '/avatars/avatar-secondary.png'
  ];

  const [emailCopied, setEmailCopied] = useState(false);

  // Blueprint hover highlight & mouse spotlight tracking (manishx.in reference)
  const heroCardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardMouseMove = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCardMouseEnter = () => {
    setIsHovered(true);
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCopyEmailAddress = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    haptic(45);
    sound.playSuccess();
    onCopyEmail(chanh.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // Keyboard shortcut listener to reflect 'C' keypress on the copy button
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'c') {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAvatarClick = () => {
    sound.playClick();
    setAvatarIndex((prev) => (prev + 1) % avatarPhotos.length);
  };

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
    location: 'Uttarakhand, India',
    email: 'eth@ayusharyan.in',
    socials: {
      twitter: 'https://x.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      figma: 'https://figma.com/@ayusharyan',
      dribbble: 'https://dribbble.com/ayusharyan',
      buymeacoffee: 'https://buymeacoffee.com/ayusharyan'
    }
  };

  const socialLinks = [
    { name: 'X / Twitter', icon: TwitterIcon, url: chanh.socials?.twitter || 'https://x.com' },
    { name: 'GitHub', icon: GithubIcon, url: chanh.socials?.github || 'https://github.com' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: chanh.socials?.linkedin || 'https://linkedin.com' },
    { name: 'Figma', icon: FigmaIcon, url: chanh.socials?.figma || 'https://figma.com/@ayusharyan' },
    { name: 'Dribbble', icon: DribbbleIcon, url: chanh.socials?.dribbble || 'https://dribbble.com/ayusharyan' },
    { name: 'Buy Me a Coffee', icon: BuyMeACoffeeIcon, url: chanh.socials?.buymeacoffee || 'https://buymeacoffee.com/ayusharyan' }
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
        {/* Main Hero Card with architectural blueprint dashed border & hover highlight (manishx.in reference) */}
        <ScrollRevealGroup
          as="div"
          ref={heroCardRef}
          onMouseMove={handleCardMouseMove}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          className={`screen-box hero-card blueprint-hero-card ${isHovered ? 'is-hovered' : ''}`}
          style={{
            padding: '36px 32px'
          }}
          stagger={0.08}
          delayChildren={0.04}
        >
          {/* Architectural Blueprint Dashed Border Lines with Crosshair Overshoots */}
          <div className="blueprint-border-line blueprint-line-top" aria-hidden="true" />
          <div className="blueprint-border-line blueprint-line-bottom" aria-hidden="true" />
          <div className="blueprint-border-line blueprint-line-left" aria-hidden="true" />
          <div className="blueprint-border-line blueprint-line-right" aria-hidden="true" />

          {/* Corner Crosshair (+) Markers */}
          <span className="blueprint-corner blueprint-corner-tl" aria-hidden="true">+</span>
          <span className="blueprint-corner blueprint-corner-tr" aria-hidden="true">+</span>
          <span className="blueprint-corner blueprint-corner-bl" aria-hidden="true">+</span>
          <span className="blueprint-corner blueprint-corner-br" aria-hidden="true">+</span>

          {/* Interactive Mouse Spotlight Radial Glow */}
          <div
            className="blueprint-spotlight"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, var(--hero-spotlight, rgba(255,255,255,0.04)), transparent 65%)`
            }}
            aria-hidden="true"
          />

          {/* Profile Bar with Dual Avatar Reveal */}
          <ScrollRevealItem distance={16}>
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
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
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
                  loading="lazy"
                  decoding="async"
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
          </ScrollRevealItem>

          {/* Chanh Dai Signature Hero Box */}
          <ScrollRevealItem distance={18}>
            <div className="chanh-hero-wrapper">
              {/* Top Social Row - Clean, clear background */}
              <div className="chanh-top-strip">
                {/* Handwritten "Follow Me" placed OUTSIDE the card dashed border, pointing directly at the first social button */}
                <div className="chanh-outside-connect">
                  <span className="chanh-connect-text">Follow Me</span>
                  <svg
                    width="46"
                    height="34"
                    viewBox="0 0 46 34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="chanh-connect-arrow"
                    aria-hidden="true"
                  >
                    <path d="M 5 4 C 5 16, 16 24, 44 24" />
                    <path d="M 36 18 L 44 24 L 36 30" />
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
                    <span className="chanh-badge" title="Buy Me a Coffee" aria-label="Buy Me a Coffee">
                      <BuyMeACoffeeIcon size={14} />
                    </span>
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
                    <div className="chanh-item-text chanh-email-row">
                      <a
                        href={`mailto:${chanh.email}`}
                        className="chanh-link"
                        title={`Send email to ${chanh.email}`}
                      >
                        {chanh.email}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmailAddress}
                        className={`chanh-email-copy-btn ${emailCopied ? 'copied' : ''}`}
                        title={emailCopied ? 'Copied' : 'Copy email (or press C)'}
                        aria-label={emailCopied ? 'Email address copied' : 'Copy email address'}
                      >
                        {emailCopied ? (
                          <Check size={12} strokeWidth={2.4} className="chanh-copy-check-icon" />
                        ) : (
                          <Copy size={12} strokeWidth={1.8} className="chanh-copy-idle-icon" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: About / Bio Text */}
                <div className="chanh-grid-column right-col chanh-about-col">
                  <p className="chanh-about-text">
                    {personal.shortBio}
                  </p>
                </div>
              </div>
            </div>
          </ScrollRevealItem>
        </ScrollRevealGroup>
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
