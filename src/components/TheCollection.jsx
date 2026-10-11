import React, { useState } from 'react';
import {
  ShieldAlert,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Search
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function TheCollection({ collection = [] }) {
  const [openSections, setOpenSections] = useState({ 0: true, 1: false, 2: false });

  const toggleSection = (idx) => {
    sound.playClick();
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getSectionIcon = (category) => {
    switch (category) {
      case 'Security Research':
        return ShieldAlert;
      case 'Milestones & Honors':
        return Award;
      default:
        return BookOpen;
    }
  };

  return (
    <section id="collection" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '32px' }}>
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
            03 / Curiosities & Accolades
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginTop: '4px'
            }}
          >
            The collection.{' '}
            <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              More work, more curiosity.
            </span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Responsible disclosures, engineering recognitions, publications, and independent security research.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {collection.map((cat, idx) => {
            const Icon = getSectionIcon(cat.category);
            const isOpen = !!openSections[idx];

            return (
              <div key={cat.category} className="screen-box" style={{ overflow: 'hidden' }}>
                {/* Accordion Title Trigger */}
                <button
                  onClick={() => toggleSection(idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    background: 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)'
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>{cat.category}</div>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: 'var(--text-muted)' }}>
                        {cat.count}
                      </div>
                    </div>
                  </div>

                  <div style={{ color: 'var(--text-muted)' }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 20px',
                      borderTop: '1px dashed var(--border-dashed)',
                      paddingTop: '16px'
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '12px'
                      }}
                    >
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-muted)',
                            border: '1px solid var(--border-secondary)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {item.title}
                            </span>
                            {item.year && (
                              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-family-mono)', color: 'var(--text-muted)' }}>
                                {item.year}
                              </span>
                            )}
                            {item.bounty && (
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontFamily: 'var(--font-family-mono)',
                                  color: 'var(--accent)',
                                  padding: '2px 6px',
                                  borderRadius: 'var(--radius-sm)',
                                  background: 'var(--accent-tint)'
                                }}
                              >
                                {item.bounty}
                              </span>
                            )}
                          </div>

                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
