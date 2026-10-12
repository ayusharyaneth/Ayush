import React, { useState } from 'react';
import { Mail, Calendar, ArrowUpRight, Check } from 'lucide-react';
import SocialCards from './SocialCards';
import { sound } from '../utils/soundEffects';

export default function ContactSection({ personal, socials, onCopyEmail, onBookCall }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    sound.playSuccess();
    onCopyEmail();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" style={{ paddingTop: '56px', paddingBottom: '72px' }}>
      <div className="container">

        {/* Big Editorial CTA Card */}
        <div
          className="screen-box"
          style={{
            padding: '48px 36px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-family-mono)',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              marginBottom: '8px'
            }}
          >
            04 / Collaboration & Inquiries
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              maxWidth: '680px',
              marginBottom: '16px'
            }}
          >
            Have something in mind?{' '}
            <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--accent)' }}>
              Let&rsquo;s make something great.
            </span>
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}
          >
            Always excited to discuss founding engineer roles, technical advisory, high-craft design systems, or early-stage 0 → 1 prototypes.
          </p>

          {/* Email Trigger Box with Copy feedback */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '36px'
            }}
          >
            <button
              onClick={handleCopy}
              className="btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                borderRadius: 'var(--radius-lg)'
              }}
              title="Click or press C on your keyboard"
            >
              {copied ? <Check size={18} /> : <Mail size={18} />}
              <span>{personal.email}</span>
              <kbd className="kbd-chip" style={{ marginLeft: '4px', background: 'rgba(0,0,0,0.15)', color: 'inherit' }}>
                C
              </kbd>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onBookCall();
              }}
              className="btn-secondary"
              style={{
                padding: '12px 20px',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Calendar size={16} />
              <span>Book a 15-min call</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Social Profiles Row */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-family-mono)',
                color: 'var(--text-muted)',
                marginBottom: '14px'
              }}
            >
              Or connect across social networks:
            </div>
            <SocialCards socials={socials} email={personal.email} />
          </div>
        </div>
      </div>
    </section>
  );
}
