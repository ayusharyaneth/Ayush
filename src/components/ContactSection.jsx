import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import {
  TwitterIcon,
  GithubIcon,
  TelegramIcon,
  LinkedinIcon,
  BuyMeACoffeeIcon
} from './Icons';
import { sound } from '../utils/soundEffects';
import { haptic } from '../utils/haptic';
import './ContactSection.css';

/**
 * Editorial Contact Section
 * High-craft typography, clean architectural card layout,
 * near-black canvas, and cinematic coordinated motion.
 */
export default function ContactSection({
  personal = {},
  onCopyEmail,
  showToast
}) {
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // Blueprint hover highlight & mouse spotlight tracking (same effect as hero header)
  const contactCardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardMouseMove = (e) => {
    if (!contactCardRef.current) return;
    const rect = contactCardRef.current.getBoundingClientRect();
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

  const contactEmail =
    personal?.chanhCard?.email || personal?.email || 'eth@ayusharyan.in';

  const handleActionClick = (e) => {
    e.preventDefault();
    haptic(45);
    sound.playSuccess();

    // Copy action
    if (onCopyEmail) {
      onCopyEmail(contactEmail);
    } else if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(contactEmail);
    }

    setCopied(true);
    if (showToast) {
      showToast('Copied', 'copy');
    }
    setTimeout(() => setCopied(false), 2400);

    // Open mail client cleanly
    setTimeout(() => {
      window.location.href = `mailto:${contactEmail}`;
    }, 280);
  };

  const socialLinks = [
    { name: 'X', icon: TwitterIcon, url: personal?.chanhCard?.socials?.twitter || 'https://x.com/ayusharyaneth' },
    { name: 'GitHub', icon: GithubIcon, url: personal?.chanhCard?.socials?.github || 'https://github.com/ayusharyaneth/' },
    { name: 'Telegram', icon: TelegramIcon, url: personal?.chanhCard?.socials?.telegram || 'https://t.me/ayusharyaneth' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: personal?.chanhCard?.socials?.linkedin || 'https://www.linkedin.com/in/theayusharyan' },
    { name: 'Buy Me a Coffee', icon: BuyMeACoffeeIcon, url: personal?.chanhCard?.socials?.buymeacoffee || 'https://buymeacoffee.com/ayusharyaneth' }
  ];

  // Motion easing curve (Apple / Linear / Chanh Dai spring)
  const easeSmooth = [0.16, 1, 0.3, 1];

  return (
    <section id="contact" className="editorial-contact-section">
      {/* Atmospheric Hairline Grid Accent Overlay */}
      <div className="contact-atmosphere" aria-hidden="true">
        <div className="contact-grid-pattern" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          ref={contactCardRef}
          onMouseMove={handleCardMouseMove}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          className={`contact-editorial-card blueprint-hero-card ${isHovered ? 'is-hovered' : ''}`}
        >
          {/* Architectural Blueprint Dashed Border Lines with Overshoots (Exact Hero Header Pattern) */}
          <div className="blueprint-border-line blueprint-line-top" aria-hidden="true" />
          <div className="blueprint-border-line blueprint-line-bottom" aria-hidden="true" />
          <div className="blueprint-border-line blueprint-line-left" aria-hidden="true" />
          <div className="blueprint-border-line blueprint-line-right" aria-hidden="true" />

          {/* Interactive Mouse Spotlight Radial Glow (Exact Hero Header Effect) */}
          <div
            className="blueprint-spotlight"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, var(--hero-spotlight, rgba(255, 255, 255, 0.045)), transparent 65%)`
            }}
            aria-hidden="true"
          />


          {/* Top Meta Row */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: easeSmooth }}
            className="contact-meta-header"
          >
            <div className="contact-badge-label">
              <span className="contact-accent-dot" />
              <span>GET IN TOUCH</span>
            </div>
          </motion.div>

          {/* Elegant Italic Serif Supporting Statement */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: easeSmooth }}
            className="contact-statement-wrap"
          >
            <p className="contact-statement-text">
              Open to meaningful collaborations, ambitious ideas, and opportunities to build things that make a difference.
            </p>
          </motion.div>

          {/* Primary Action Hub: Minimal Outlined Arrow CTA + Compact Social Row */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.18, ease: easeSmooth }}
            className="contact-action-hub"
          >
            {/* Functional Outlined Arrow CTA */}
            <div
              onClick={handleActionClick}
              onMouseEnter={() => sound.playCardHover()}
              className="contact-primary-cta-group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleActionClick(e);
                }
              }}
              title="Click to copy email & open message"
            >
              <div className="cta-text-block">
                <span className="cta-lead-label">
                  {copied ? 'Copied' : 'Initiate Transmission'}
                  {copied ? <Check size={14} style={{ color: 'var(--accent)' }} /> : <Sparkles size={14} style={{ color: 'var(--accent)' }} />}
                </span>
                <span className="cta-email-sub">{contactEmail}</span>
              </div>

              <div className="contact-arrow-circle">
                <ArrowUpRight size={18} className="contact-arrow-icon" strokeWidth={2} />
              </div>
            </div>

            {/* Compact Social Row */}
            <div className="contact-social-row">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-pill"
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => sound.playClick()}
                    title={item.name}
                    aria-label={item.name}
                  >
                    <Icon size={14} />
                    <span className="contact-social-label">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
