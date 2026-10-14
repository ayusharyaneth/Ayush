import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Copy, Check, Sparkles } from 'lucide-react';
import {
  TwitterIcon,
  GithubIcon,
  LinkedinIcon,
  FigmaIcon,
  BuyMeACoffeeIcon
} from './Icons';
import { sound } from '../utils/soundEffects';
import { haptic } from '../utils/haptic';
import './ContactSection.css';

/**
 * Editorial Contact Section
 * Inspired by high-craft typography, vibrant lime-green graphic stickers,
 * near-black canvas, and cinematic coordinated motion.
 */
export default function ContactSection({
  personal = {},
  onCopyEmail,
  showToast
}) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const contactEmail =
    personal?.chanhCard?.email || personal?.email || 'eth@ayusharyan.in';

  // Pointer tracking for organic parallax on desktop
  const handlePointerMove = (e) => {
    if (prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Calculate normalized coordinate from -1 to 1
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointerOffset({ x, y });
  };

  const handlePointerLeave = () => {
    setPointerOffset({ x: 0, y: 0 });
  };

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

  const handleStickerClick = () => {
    haptic(35);
    sound.playPop();
  };

  const socialLinks = [
    { name: 'X / Twitter', icon: TwitterIcon, url: personal?.chanhCard?.socials?.twitter || 'https://x.com' },
    { name: 'GitHub', icon: GithubIcon, url: personal?.chanhCard?.socials?.github || 'https://github.com' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: personal?.chanhCard?.socials?.linkedin || 'https://linkedin.com' },
    { name: 'Figma', icon: FigmaIcon, url: personal?.chanhCard?.socials?.figma || 'https://figma.com/@ayusharyan' },
    { name: 'Buy Me a Coffee', icon: BuyMeACoffeeIcon, url: personal?.chanhCard?.socials?.buymeacoffee || 'https://buymeacoffee.com/ayusharyan' }
  ];

  // Motion easing curve (Apple / Linear / Chanh Dai spring)
  const easeSmooth = [0.16, 1, 0.3, 1];

  return (
    <section id="contact" className="editorial-contact-section">
      {/* Atmospheric Ambient Lighting & Rotating Celestial Orbit */}
      <div className="contact-atmosphere" aria-hidden="true">
        <div className="contact-glow-lime" />
        <div className="contact-glow-cyan" />
        <div className="contact-grid-pattern" />

        <div className="contact-orbital-wrapper">
          <div className="contact-orbital-ring">
            <span className="contact-orbital-node" />
          </div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          ref={containerRef}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          className="contact-editorial-card"
        >
          {/* Architectural Blueprint Corner Crosshair Indicators */}
          <span className="contact-card-corner contact-corner-tl" aria-hidden="true">+</span>
          <span className="contact-card-corner contact-corner-tr" aria-hidden="true">+</span>
          <span className="contact-card-corner contact-corner-bl" aria-hidden="true">+</span>
          <span className="contact-card-corner contact-corner-br" aria-hidden="true">+</span>

          {/* Desktop Vertical Edge Typography */}
          <div className="contact-vertical-edge-left" aria-hidden="true">
            AYUSH ARYAN · EST. 2026 · SYSTEM & CRAFT
          </div>
          <div className="contact-vertical-edge-right" aria-hidden="true">
            AVAILABLE WORLDWIDE · SELECT OPPORTUNITIES
          </div>

          {/* Top Meta Row */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
            className="contact-meta-header"
          >
            <div className="contact-badge-label">
              <span className="contact-lime-dot" />
              <span>GET IN TOUCH</span>
            </div>

            <div className="contact-meta-coordinates">
              <span>LOC: UTTARAKHAND, IN · 30.06° N 79.01° E</span>
            </div>
          </motion.div>

          {/* Floating Lime-Green Ticket Stickers & Graphic Elements */}
          <div className="contact-stickers-layer">
            {/* STICKER 1: ADMIT ONE / COLLAB TICKET (Top-Right) */}
            <motion.div
              onClick={handleStickerClick}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.75, rotate: 0 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1, rotate: 7 }}
              viewport={{ once: true, amount: 0.2 }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      x: pointerOffset.x * 12,
                      y: pointerOffset.y * 12 + Math.sin(Date.now() / 1000) * 4,
                      rotate: [7, 9, 7]
                    }
              }
              transition={{
                rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: 0.25, ease: 'easeOut' },
                y: { duration: 0.25, ease: 'easeOut' }
              }}
              className="contact-sticker sticker-ticket-admit"
              title="Click to interact"
            >
              <span className="ticket-notch-left" />
              <span className="ticket-notch-right" />
              <div className="ticket-header">
                <span className="ticket-admit-text">ADMIT ONE ✦ COLLAB</span>
                <span className="ticket-star">★</span>
              </div>
              <div className="ticket-perforation" />
              <div className="ticket-barcode-row">
                <svg className="ticket-barcode-svg" viewBox="0 0 64 16" fill="currentColor">
                  <rect x="0" y="0" width="2" height="16" />
                  <rect x="4" y="0" width="4" height="16" />
                  <rect x="10" y="0" width="1" height="16" />
                  <rect x="13" y="0" width="3" height="16" />
                  <rect x="18" y="0" width="2" height="16" />
                  <rect x="22" y="0" width="5" height="16" />
                  <rect x="29" y="0" width="1" height="16" />
                  <rect x="32" y="0" width="3" height="16" />
                  <rect x="37" y="0" width="2" height="16" />
                  <rect x="41" y="0" width="4" height="16" />
                  <rect x="47" y="0" width="1" height="16" />
                  <rect x="50" y="0" width="3" height="16" />
                  <rect x="55" y="0" width="2" height="16" />
                  <rect x="59" y="0" width="5" height="16" />
                </svg>
                <span className="ticket-serial">№ 2026-ETH</span>
              </div>
            </motion.div>

            {/* STICKER 2: STATUS OVAL PILL (Top-Left) */}
            <motion.div
              onClick={handleStickerClick}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.75, rotate: 0 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1, rotate: -8 }}
              viewport={{ once: true, amount: 0.2 }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      x: pointerOffset.x * -10,
                      y: pointerOffset.y * -10,
                      rotate: [-8, -10, -8]
                    }
              }
              transition={{
                rotate: { duration: 6.2, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: 0.25, ease: 'easeOut' },
                y: { duration: 0.25, ease: 'easeOut' }
              }}
              className="contact-sticker sticker-status-pill"
              title="Click to interact"
            >
              <span className="sticker-status-dot" />
              <span>STATUS: AVAILABLE ✦ 2026</span>
            </motion.div>

            {/* STICKER 3: ROTATING CRAFT SEAL (Bottom-Right) */}
            <motion.div
              onClick={handleStickerClick}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.75 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      x: pointerOffset.x * 14,
                      y: pointerOffset.y * 14
                    }
              }
              transition={{
                x: { duration: 0.25, ease: 'easeOut' },
                y: { duration: 0.25, ease: 'easeOut' }
              }}
              className="contact-sticker sticker-craft-seal"
              title="Click to interact"
            >
              <svg className="seal-svg-rotating" viewBox="0 0 100 100">
                <path
                  id="sealTextPath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text fill="#ccff00" fontSize="9.2" fontFamily="monospace" letterSpacing="2">
                  <textPath href="#sealTextPath" startOffset="0%">
                    · HIGH CRAFT · 0 TO 1 CODE · DESIGN ·
                  </textPath>
                </text>
              </svg>
              <span className="seal-center-badge">✦</span>
            </motion.div>
          </div>

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
                  {copied ? <Check size={14} style={{ color: 'var(--lime-electric)' }} /> : <Sparkles size={14} style={{ color: 'var(--lime-electric)' }} />}
                </span>
                <span className="cta-email-sub">{contactEmail}</span>
              </div>

              <div className="contact-arrow-circle">
                <ArrowUpRight size={22} className="contact-arrow-icon" strokeWidth={2} />
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
