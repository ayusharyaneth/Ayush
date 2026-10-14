import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import {
  TwitterIcon,
  GithubIcon,
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
      showToast(`Email copied: ${contactEmail}`, 'success');
    }
    setTimeout(() => setCopied(false), 2400);

    // Open mail client cleanly
    setTimeout(() => {
      window.location.href = `mailto:${contactEmail}`;
    }, 280);
  };

  const socialLinks = [
    { name: 'X / Twitter', icon: TwitterIcon, url: personal?.chanhCard?.socials?.twitter || 'https://x.com/ayusharyaneth' },
    { name: 'GitHub', icon: GithubIcon, url: personal?.chanhCard?.socials?.github || 'https://github.com/ayusharyaneth/' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: personal?.chanhCard?.socials?.linkedin || 'https://www.linkedin.com/in/theayusharyan' },
    { name: 'Buy Me a Coffee', icon: BuyMeACoffeeIcon, url: personal?.chanhCard?.socials?.buymeacoffee || 'https://buymeacoffee.com/ayusharyaneth' }
  ];

  // Motion easing curve (Apple / Linear / Chanh Dai spring)
  const easeSmooth = [0.16, 1, 0.3, 1];

  return (
    <section id="contact" className="editorial-contact-section">
      {/* Atmospheric Ambient Lighting & Rotating Celestial Orbit */}
      <div className="contact-atmosphere" aria-hidden="true">
        <div className="contact-glow-accent" />
        <div className="contact-glow-secondary" />
        <div className="contact-grid-pattern" />

        <div className="contact-orbital-wrapper">
          <div className="contact-orbital-ring">
            <span className="contact-orbital-node" />
          </div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-editorial-card">
          {/* Architectural Blueprint Corner Crosshair Indicators */}
          <span className="contact-card-corner contact-corner-tl" aria-hidden="true">+</span>
          <span className="contact-card-corner contact-corner-tr" aria-hidden="true">+</span>
          <span className="contact-card-corner contact-corner-bl" aria-hidden="true">+</span>
          <span className="contact-card-corner contact-corner-br" aria-hidden="true">+</span>

          {/* Top Meta Row */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
            className="contact-meta-header"
          >
            <div className="contact-badge-label">
              <span className="contact-accent-dot" />
              <span>GET IN TOUCH</span>
            </div>
          </motion.div>

          {/* Oversized Cinematic Editorial Headline */}
          <div className="contact-headline-stage">
            <h2 className="contact-headline">
              {/* Line 1: "Let's make" */}
              <span className="headline-mask">
                <motion.span
                  initial={prefersReducedMotion ? {} : { y: '115%', opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { y: '0%', opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, delay: 0.12, ease: easeSmooth }}
                  className="headline-line"
                >
                  Let&rsquo;s make
                </motion.span>
              </span>

              {/* Line 2: "great work" (Italic Serif) */}
              <span className="headline-mask">
                <motion.span
                  initial={prefersReducedMotion ? {} : { y: '115%', opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { y: '0%', opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, delay: 0.25, ease: easeSmooth }}
                  className="headline-line headline-serif-italic"
                >
                  great work
                </motion.span>
              </span>

              {/* Line 3: "together." */}
              <span className="headline-mask">
                <motion.span
                  initial={prefersReducedMotion ? {} : { y: '115%', opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { y: '0%', opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, delay: 0.38, ease: easeSmooth }}
                  className="headline-line"
                >
                  together<span className="headline-period">.</span>
                </motion.span>
              </span>
            </h2>
          </div>

          {/* Elegant Italic Serif Supporting Statement */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.52, ease: easeSmooth }}
            className="contact-statement-wrap"
          >
            <p className="contact-statement-text">
              &ldquo;Always excited to discuss founding engineer roles, technical advisory, high-craft design systems, or early-stage 0 &rarr; 1 prototypes.&rdquo;
            </p>
          </motion.div>

          {/* Primary Action Hub: Minimal Outlined Arrow CTA + Compact Social Row */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 22 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.64, ease: easeSmooth }}
            className="contact-action-hub"
          >
            {/* Functional Outlined Arrow CTA */}
            <div
              onClick={handleActionClick}
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
                  {copied ? 'Email Copied!' : 'Initiate Transmission'}
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
                    onClick={() => sound.playClick()}
                    title={item.name}
                  >
                    <Icon size={14} />
                    <span>{item.name}</span>
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
