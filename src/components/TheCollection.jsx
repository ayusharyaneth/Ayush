import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Award,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import ChevronsUpDownIcon from './ChevronsUpDownIcon';
import { sound } from '../utils/soundEffects';
import { haptic } from '../utils/haptic';
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';

export default function TheCollection({ collection = [] }) {
  // Compact by default: all sections start collapsed
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (idx) => {
    sound.playClick();
    haptic(35);
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
    <section id="collection" style={{ paddingTop: '28px', paddingBottom: '28px' }}>
      <div className="container">
        {/* Section Header */}
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
        </ScrollReveal>

        {/* Accordion List */}
        <ScrollRevealGroup
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          stagger={0.08}
        >
          {collection.map((cat, idx) => {
            const Icon = getSectionIcon(cat.category);
            const isOpen = !!openSections[idx];

            return (
              <ScrollRevealItem
                key={cat.category}
                as="div"
                className="screen-box"
                distance={18}
                style={{
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  borderLeft: isOpen ? '3px solid var(--accent)' : '1px dashed var(--border-dashed)'
                }}
              >
                {/* Accordion Title Trigger Header */}
                <div
                  onClick={() => toggleSection(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleSection(idx);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-muted)',
                        border: '1px solid var(--border-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {cat.category}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-family-mono)',
                          color: 'var(--accent)',
                          fontWeight: 500,
                          marginTop: '2px'
                        }}
                      >
                        {cat.count}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="collection-expander-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(idx);
                    }}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `Collapse ${cat.category}` : `Expand ${cat.category}`}
                  >
                    <ChevronsUpDownIcon open={isOpen} size={16} duration={0.25} />
                  </button>
                </div>

                {/* Collapsible Content with Smooth Physics Animation */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`content-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          padding: '0 24px 22px',
                          borderTop: '1px dashed var(--border-dashed)',
                          paddingTop: '18px'
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
                              className="collection-item-card"
                              style={{
                                padding: '14px 16px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-muted)',
                                border: '1px solid var(--border-secondary)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                gap: '8px',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {item.title}
                                </span>
                                {item.year && (
                                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-family-mono)', color: 'var(--text-muted)', flexShrink: 0 }}>
                                    {item.year}
                                  </span>
                                )}
                                {item.bounty && (
                                  <span
                                    style={{
                                      fontSize: '0.68rem',
                                      fontFamily: 'var(--font-family-mono)',
                                      color: 'var(--accent)',
                                      padding: '2px 7px',
                                      borderRadius: 'var(--radius-sm)',
                                      background: 'var(--accent-tint)',
                                      border: '1px solid var(--border-secondary)',
                                      flexShrink: 0
                                    }}
                                  >
                                    {item.bounty}
                                  </span>
                                )}
                                {item.url && item.url !== '#' && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
                                    aria-label={`Read ${item.title}`}
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>

                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                {item.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollRevealItem>
            );
          })}
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
