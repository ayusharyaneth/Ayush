import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Check, Copy, ArrowUpRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { haptic } from '../utils/haptic';
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';
import './ContactSection.css';

const COLLAB_TRACKS = [
  {
    id: 'founding',
    label: '⚡ Founding Engineer',
    placeholder: 'Tell me about the product vision, current stage, and your tech stack...'
  },
  {
    id: 'systems',
    label: '✦ Design Systems & UI Craft',
    placeholder: 'Describe your component architecture, token strategy, or framerate targets...'
  },
  {
    id: 'advisory',
    label: '⚙ Technical Advisory',
    placeholder: 'What architecture decisions, performance bottlenecks, or scaling milestones are ahead?'
  },
  {
    id: 'prototype',
    label: '🚀 0 → 1 MVP Build',
    placeholder: 'What is the core hypothesis, target users, and desired launch timeline?'
  },
  {
    id: 'say_hi',
    label: '☕ Say Hello',
    placeholder: 'Drop a friendly note, share thoughts on my work, or discuss open-source craft...'
  }
];

export default function ContactSection({ personal, onCopyEmail }) {
  const [activeTrack, setActiveTrack] = useState('founding');
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const primaryEmail = personal?.chanhCard?.email || personal?.email || 'eth@ayusharyan.in';
  const currentTrack = COLLAB_TRACKS.find((t) => t.id === activeTrack) || COLLAB_TRACKS[0];

  const handleSelectTrack = (trackId) => {
    sound.playClick();
    haptic(25);
    setActiveTrack(trackId);
  };

  const handleCopyDirectEmail = (e) => {
    e.preventDefault();
    sound.playSuccess();
    haptic(45);

    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(primaryEmail);
      }
    } catch {
      // fallback handled
    }

    // Micro confetti blast from bottom left
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { x, y },
        colors: ['#38bdf8', '#818cf8', '#c084fc', '#ffffff'],
        disableForReducedMotion: true
      });
    } catch {
      // safe fallback
    }

    if (onCopyEmail) {
      onCopyEmail(primaryEmail);
    }

    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playSuccess();
    haptic(60);

    // Celebratory confetti burst
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#38bdf8', '#34d399', '#60a5fa', '#f472b6', '#fcd34d'],
        disableForReducedMotion: true
      });
    } catch {
      // safe
    }

    const cleanTrackName = currentTrack.label.replace(/^[^\w]+/, '').trim();
    const subject = encodeURIComponent(
      `[Inquiry: ${cleanTrackName}] ${name.trim() ? `from ${name.trim()}` : 'Collaboration Opportunity'}`
    );
    const bodyContent = [
      `Hi Ayush,`,
      ``,
      message.trim() || currentTrack.placeholder,
      ``,
      `---`,
      `Sender: ${name.trim() || 'Not specified'}`,
      `Email: ${senderEmail.trim() || 'Not specified'}`,
      `Focus Area: ${cleanTrackName}`
    ].join('\n');

    const body = encodeURIComponent(bodyContent);
    const mailtoLink = `mailto:${primaryEmail}?subject=${subject}&body=${body}`;

    // Open mail client
    window.location.href = mailtoLink;
    setIsSent(true);
  };

  const handleCopyDraft = () => {
    sound.playClick();
    haptic(35);
    const cleanTrackName = currentTrack.label.replace(/^[^\w]+/, '').trim();
    const draftText = `Subject: [Inquiry: ${cleanTrackName}] ${name.trim() || 'Collaboration'}\n\n${
      message.trim() || currentTrack.placeholder
    }\n\nFrom: ${name || 'N/A'}\nEmail: ${senderEmail || 'N/A'}`;

    try {
      navigator.clipboard.writeText(draftText);
    } catch {
      // safe
    }
  };

  return (
    <section id="contact" style={{ paddingTop: '28px', paddingBottom: '36px' }}>
      <div className="container">
        <ScrollReveal variant="fade-up" distance={24} duration={0.7}>
          <div className="contact-console-card">
            {/* Ambient Background Radial Highlight */}
            <div className="contact-ambient-glow" />

            {/* Architectural Blueprint Corner Crosshairs */}
            <span className="contact-corner-mark contact-corner-tl">+</span>
            <span className="contact-corner-mark contact-corner-tr">+</span>
            <span className="contact-corner-mark contact-corner-bl">+</span>
            <span className="contact-corner-mark contact-corner-br">+</span>

            <ScrollRevealGroup
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1
              }}
              stagger={0.08}
              delayChildren={0.05}
            >
              {/* Header Bar */}
              <ScrollRevealItem distance={16}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                  >
                    04 / Collaboration & Inquiries
                  </div>

                  <div className="contact-status-badge">
                    <span className="contact-status-dot" />
                    <span>Available for select engagements</span>
                  </div>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.1rem, 4.8vw, 3.2rem)',
                    lineHeight: 1.15,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                    maxWidth: '720px',
                    marginBottom: '12px'
                  }}
                >
                  Have an ambitious idea in mind?{' '}
                  <span
                    style={{
                      fontFamily: 'var(--font-family-serif)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: 'var(--accent)'
                    }}
                  >
                    Let&rsquo;s build something great.
                  </span>
                </h2>

                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '580px',
                    lineHeight: 1.6,
                    marginBottom: '26px'
                  }}
                >
                  Always excited to discuss founding engineer roles, technical advisory, high-craft design systems, or early-stage 0 → 1 prototypes.
                </p>
              </ScrollRevealItem>

              {/* Interactive Collaboration Track Pill Selector */}
              <ScrollRevealItem distance={14}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-family-mono)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}
                >
                  // Select Focus Area
                </div>

                <div className="contact-tracks-grid">
                  {COLLAB_TRACKS.map((track) => {
                    const isActive = activeTrack === track.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleSelectTrack(track.id)}
                        className={`contact-track-pill ${isActive ? 'active' : ''}`}
                        aria-pressed={isActive}
                      >
                        <span>{track.label}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollRevealItem>

              {/* Minimalist Glass Dispatch Terminal Form */}
              <ScrollRevealItem distance={14}>
                <form onSubmit={handleSubmit} className="contact-terminal-box">
                  <div className="contact-input-row">
                    <div className="contact-input-group">
                      <label htmlFor="contact-name" className="contact-input-label">
                        Your Name / Organization
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex (Founder @ Acme)"
                        className="contact-input"
                      />
                    </div>

                    <div className="contact-input-group">
                      <label htmlFor="contact-email" className="contact-input-label">
                        Your Return Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="contact-input"
                      />
                    </div>
                  </div>

                  <div className="contact-input-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label htmlFor="contact-message" className="contact-input-label">
                        Project Brief / Message
                      </label>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-family-mono)',
                          color: 'var(--accent)'
                        }}
                      >
                        {currentTrack.label}
                      </span>
                    </div>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={currentTrack.placeholder}
                      className="contact-textarea"
                    />
                  </div>

                  {/* Action Bar */}
                  <div className="contact-actions-row">
                    <button
                      type="button"
                      onClick={handleCopyDirectEmail}
                      className="contact-copy-badge"
                      title="Click to copy direct email address to clipboard"
                    >
                      {copiedEmail ? <Check size={14} style={{ color: '#4ade80' }} /> : <Mail size={14} />}
                      <span>{copiedEmail ? 'Email Copied!' : primaryEmail}</span>
                      <kbd
                        style={{
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          background: 'rgba(255,255,255,0.08)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        copy
                      </kbd>
                    </button>

                    <button type="submit" className="contact-submit-btn">
                      <span>Dispatch Inquiry</span>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>

                  {/* Submission Confirmation Feedback */}
                  {isSent && (
                    <div className="contact-success-banner">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} />
                        <span>Inquiry draft prepared and opened in your email client!</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyDraft}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'inherit',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-family-mono)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Copy size={13} />
                        <span>Copy draft</span>
                      </button>
                    </div>
                  )}
                </form>
              </ScrollRevealItem>

              {/* Technical Meta Footer Line */}
              <ScrollRevealItem distance={10}>
                <div className="contact-meta-row">
                  <div className="contact-meta-item">
                    <Clock size={13} style={{ color: 'var(--accent)' }} />
                    <span>IST (UTC+5:30) • Typical turnaround &lt; 4 hours</span>
                  </div>
                  <div className="contact-meta-item">
                    <ShieldCheck size={13} style={{ color: '#4ade80' }} />
                    <span>Direct, confidential & encrypted discussion</span>
                  </div>
                </div>
              </ScrollRevealItem>
            </ScrollRevealGroup>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
