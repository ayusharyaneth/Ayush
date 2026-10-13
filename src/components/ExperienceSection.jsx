import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, ChevronDown, ChevronUp, Sparkles, CheckCircle } from 'lucide-react';
import GithubHeatmap from './GithubHeatmap';
import { sound } from '../utils/soundEffects';

export default function ExperienceSection({ experience = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleExpand = (index) => {
    sound.playClick();
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <section id="experience" style={{ paddingTop: '28px', paddingBottom: '28px' }}>
      <div className="container">
        {/* Section Header */}
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
            02 / Work & Craft
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
            In good company.{' '}
            <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              Teams & systems.
            </span>
          </h2>
        </div>

        {/* Timeline Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {experience.map((item, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={item.company}
                className="screen-box"
                style={{
                  padding: '24px 26px',
                  transition: 'all 0.2s ease',
                  borderLeft: isExpanded ? '3px solid var(--accent)' : '1px dashed var(--border-dashed)'
                }}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-muted)',
                        border: '1px solid var(--border-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-family-mono)'
                      }}
                    >
                      {item.company.charAt(0)}
                    </div>

                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.company}
                      </div>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--accent)',
                          fontFamily: 'var(--font-family-mono)',
                          fontWeight: 500
                        }}
                      >
                        {item.role}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        textAlign: 'right',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-family-mono)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <div>{item.period}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{item.location}</div>
                    </div>

                    <button
                      style={{
                        color: 'var(--text-muted)',
                        padding: '4px',
                        borderRadius: '4px'
                      }}
                      aria-label={isExpanded ? 'Collapse role' : 'Expand role'}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Summary & Bullet Points */}
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginTop: '16px'
                  }}
                >
                  {item.summary}
                </p>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border-dashed)' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Key Impact Deliverables
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.achievements.map((ach, aIdx) => (
                        <li
                          key={aIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5
                          }}
                        >
                          <span style={{ color: 'var(--accent)', marginTop: '2px' }}>✦</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Skill Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
                      {item.skills.map((s) => (
                        <span key={s} className="tech-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Embedded Interactive 52-Week GitHub Heatmap */}
        <GithubHeatmap />
      </div>
    </section>
  );
}
