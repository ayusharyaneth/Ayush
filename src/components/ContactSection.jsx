import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Clock,
  Globe,
  Sparkles,
  Zap
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { haptic } from '../utils/haptic';
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';
import './ContactSection.css';

const INQUIRY_TOPICS = [
  { id: 'founding', label: 'Founding Engineer', subject: 'Inquiry: Founding Engineer Opportunity' },
  { id: 'advisory', label: 'Technical Advisory', subject: 'Inquiry: Technical Advisory / Architecture' },
  { id: 'systems', label: 'Design Systems & UI', subject: 'Inquiry: High-Craft Design Systems' },
  { id: 'prototype', label: '0 → 1 Prototyping', subject: 'Inquiry: Rapid 0 → 1 Prototype' },
  { id: 'hello', label: 'Just Saying Hi', subject: 'Hello from your portfolio' }
];

export default function ContactSection({ personal = {}, onCopyEmail }) {
  const email = personal?.email || 'eth@ayusharyan.in';
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(INQUIRY_TOPICS[0]);
  const [localTime, setLocalTime] = useState('');

  // Live ticking IST clock (Asia/Kolkata UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(new Date());
        setLocalTime(timeStr);
      } catch {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    haptic(45);
    sound.playSuccess();
    if (onCopyEmail) onCopyEmail(email);
    else navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopicClick = (topic) => {
    sound.playClick();
    haptic(30);
    setSelectedTopic(topic);
  };

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(selectedTopic.subject)}`;

  return (
    <section id="contact" style={{ paddingTop: '28px', paddingBottom: '36px' }}>
      <div className="container">
        {/* Editorial Section Heading */}
        <ScrollReveal variant="fade-up" distance={20} duration={0.6}>
          <div style={{ marginBottom: '24px' }}>
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
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4.2vw, 2.9rem)',
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
                marginTop: '4px'
              }}
            >
              Have something in mind?{' '}
              <span
                style={{
                  fontFamily: 'var(--font-family-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--accent)'
                }}
              >
                Let&rsquo;s make something great.
              </span>
            </h2>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '620px',
                marginTop: '8px'
              }}
            >
              Always excited to discuss founding engineer roles, technical advisory, high-craft design systems, or early-stage 0 → 1 prototypes.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <ScrollRevealGroup
          className="contact-bento-grid"
          stagger={0.1}
          delayChildren={0.06}
        >
          {/* Bento Card 1: Status & Live Time HUD */}
          <ScrollRevealItem
            as="div"
            className="screen-box contact-bento-card"
            distance={18}
          >
            <div>
              {/* Radar Status Badge */}
              <div className="status-radar-badge">
                <span className="status-radar-dot">
                  <span className="status-radar-ping" />
                </span>
                <span>Available for Select Projects</span>
              </div>

              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Availability & Focus
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  Open for advisory, fractional architecture, or full-time founding engineer roles.
                </div>
              </div>

              {/* Real-time IST Digital Clock Display */}
              <div className="clock-display-box">
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}
                  >
                    <Clock size={12} style={{ color: 'var(--accent)' }} />
                    <span>IST (UTC+5:30) • Local Time</span>
                  </div>
                  <div className="clock-digits">
                    {localTime || 'Loading...'}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-family-mono)',
                    color: 'var(--accent)',
                    background: 'var(--accent-tint)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-secondary)',
                    textAlign: 'right'
                  }}
                >
                  Uttarakhand, IN
                </div>
              </div>
            </div>

            {/* Micro HUD Metrics */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px dashed var(--border-dashed)',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-family-mono)',
                color: 'var(--text-muted)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Zap size={13} style={{ color: 'var(--accent)' }} />
                <span>Response rate: &lt; 24h</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Globe size={13} style={{ color: 'var(--text-muted)' }} />
                <span>Remote / Worldwide</span>
              </span>
            </div>
          </ScrollRevealItem>

          {/* Bento Card 2: Interactive Smart Dispatch & Topic Selector */}
          <ScrollRevealItem
            as="div"
            className="screen-box contact-bento-card"
            distance={18}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Start a Conversation
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-family-mono)',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Direct Dispatch
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Select what best describes your project to prefill the email subject:
              </p>

              {/* Inquiry Topic Chips */}
              <div className="inquiry-chips-wrap">
                {INQUIRY_TOPICS.map((topic) => {
                  const isSelected = selectedTopic.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleTopicClick(topic)}
                      className={`inquiry-chip ${isSelected ? 'active' : ''}`}
                      aria-pressed={isSelected}
                    >
                      <Sparkles
                        size={12}
                        style={{
                          color: isSelected ? 'var(--accent)' : 'var(--text-dim)',
                          opacity: isSelected ? 1 : 0.6
                        }}
                      />
                      <span>{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specular Email Action Bar */}
            <div className="contact-email-bar">
              <div className="contact-email-text" title={email}>
                <Mail size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{email}</span>
              </div>

              <div className="contact-bar-actions">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="contact-action-btn contact-copy-btn"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <a
                  href={mailtoUrl}
                  onClick={() => sound.playClick()}
                  className="contact-action-btn contact-send-btn"
                  title="Open mail client"
                  aria-label="Send email"
                >
                  <span>Send Mail</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </ScrollRevealItem>
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
