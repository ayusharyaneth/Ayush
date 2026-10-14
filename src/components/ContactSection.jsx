import React from 'react';
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';

export default function ContactSection({ personal, socials }) {

  return (
    <section id="contact" style={{ paddingTop: '28px', paddingBottom: '36px' }}>
      <div className="container">
        {/* Big Editorial CTA Card */}
        <ScrollReveal variant="fade-up" distance={24} duration={0.7}>
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
            <ScrollRevealGroup
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
              }}
              stagger={0.08}
              delayChildren={0.05}
            >
              <ScrollRevealItem distance={16}>
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
                    marginBottom: '16px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
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
                    marginBottom: 0,
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  Always excited to discuss founding engineer roles, technical advisory, high-craft design systems, or early-stage 0 → 1 prototypes.
                </p>
              </ScrollRevealItem>
            </ScrollRevealGroup>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

