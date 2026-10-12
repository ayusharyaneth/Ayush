import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Footer({ personal, onOpenConsent }) {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px dashed var(--border-dashed)',
        paddingTop: '40px',
        paddingBottom: '48px',
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          {/* Left Column: Wordmark & Signature */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}
            >
              <span>{personal.name}</span>
            </div>

            {/* Stylized Handwritten SVG Signature (Nikhil style) */}
            <svg
              width="140"
              height="42"
              viewBox="0 0 160 48"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.85 }}
              aria-label="Handwritten signature"
            >
              <path d="M12 36C24 16 34 8 46 16C54 22 56 36 68 34C80 32 88 18 100 24C110 30 114 40 126 34C136 28 144 14 152 18" />
              <path d="M42 22C64 20 88 18 114 18" strokeDasharray="3 3" />
            </svg>

            <div style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {personal.location} · {personal.visitorsCount.toLocaleString()} visitors
            </div>
          </div>

          {/* Center Column: Design Philosophy */}
          <div style={{ textAlign: 'center', maxWidth: '320px' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.76rem' }}>
              &ldquo;Creating with code. Small details matter.&rdquo;
            </p>
            <div
              style={{
                fontFamily: 'var(--font-family-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>© 2026 {personal.name}</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onOpenConsent) onOpenConsent();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                title="Manage cookie consent & privacy preferences"
              >
                Cookie Preferences
              </button>
            </div>
          </div>

          {/* Right Column: Back to Top Trigger */}
          <div>
            <button
              onClick={scrollToTop}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.78rem', gap: '6px' }}
            >
              <span>Back to top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
