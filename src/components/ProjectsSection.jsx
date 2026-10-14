import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  List,
  ArrowUpRight
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { ScrollReveal } from './ScrollReveal';

const getResponsiveImageUrl = (url, width, quality = 75) => {
  if (!url || typeof url !== 'string' || !url.includes('images.unsplash.com')) return url;
  return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, `q=${quality}`);
};

export default function ProjectsSection({ projects = [], onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hasManuallyToggled, setHasManuallyToggled] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'list' : 'grid';
    }
    return 'grid';
  });

  useEffect(() => {
    const handleResize = () => {
      if (!hasManuallyToggled && typeof window !== 'undefined') {
        setViewMode(window.innerWidth < 768 ? 'list' : 'grid');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasManuallyToggled]);

  const categories = ['All', 'Full-Stack', 'AI & ML', 'Systems', 'Open Source'];

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  // When All is active in grid view, show the signature 3-card deck; otherwise show filtered
  const displayDeck = activeCategory === 'All' ? projects.slice(0, 3) : filtered;

  return (
    <section id="work" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <div className="container">
        {/* Section Header with Editorial Serif Flourish (Image 1 reference) */}
        <ScrollReveal variant="fade-up" distance={20} duration={0.6}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-family-mono)',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  fontWeight: 600,
                  marginBottom: '6px'
                }}
              >
                01 / SELECTED WORK
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.85rem, 3.6vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.15
                }}
              >
                Featured products.{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-family-serif)',
                    fontStyle: 'italic',
                    fontWeight: 400
                  }}
                >
                  Crafted with care.
                </span>
              </h2>
            </div>

            {/* View Mode Toggle: Grid icon & List icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '3px',
                  borderRadius: '8px',
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-line)'
                }}
              >
                <button
                  onClick={() => {
                    sound.playClick();
                    setHasManuallyToggled(true);
                    setViewMode('grid');
                  }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: viewMode === 'grid' ? 'var(--bg-card-hover)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Grid / Deck view"
                  aria-label="Grid / Deck view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setHasManuallyToggled(true);
                    setViewMode('list');
                  }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: viewMode === 'list' ? 'var(--bg-card-hover)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="List view"
                  aria-label="List view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Pills Bar (Theme-adaptive: high-contrast in both light & dark mode) */}
        <ScrollReveal variant="fade-up" distance={14} delay={0.06} duration={0.55}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '6px',
              marginBottom: '16px',
              scrollbarWidth: 'none'
            }}
          >
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  className={`project-cat-pill ${active ? 'active' : ''}`}
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory(cat);
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* 3-CARD DECK PRESENTATION (Matching manishtamang.com) */}
        {viewMode === 'grid' ? (
          <ScrollReveal variant="fade-up" distance={24} duration={0.65}>
            <div className="project-deck-stage screen-box">
              {/* DESKTOP DECK: 3 Fanned Cards (-rotate-3, rotate-1, rotate-3) */}
              <div className="project-deck-row">
                {displayDeck.map((project, idx) => {
                  const isMulti = displayDeck.length > 1;
                  const rotationClass = !isMulti
                    ? 'card-center'
                    : idx === 0
                    ? 'card-left'
                    : idx === 1
                    ? 'card-center'
                    : 'card-right';
                  const dateLabel =
                    project.category === 'Full-Stack'
                      ? 'v2.4 • Mac'
                      : project.category === 'AI & ML'
                      ? 'v1.8 • AI Studio'
                      : project.category === 'Systems'
                      ? 'v1.4 • Core'
                      : 'v3.2 • OSS';

                  return (
                    <div
                      key={project.id}
                      className={`project-deck-card ${rotationClass} group`}
                      onMouseEnter={() => sound.playTick()}
                      onClick={() => {
                        sound.playClick();
                        onSelectProject(project);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect ${project.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          sound.playClick();
                          onSelectProject(project);
                        }
                      }}
                    >
                      {/* Top Banner Image with Ticket / Sketch Aesthetic */}
                      <div className="project-card-image-box">
                        <img
                          src={getResponsiveImageUrl(project.image, 600, 75)}
                          srcSet={`${getResponsiveImageUrl(project.image, 480, 72)} 480w, ${getResponsiveImageUrl(project.image, 800, 75)} 800w, ${project.image} 1200w`}
                          sizes="(max-width: 768px) 92vw, 380px"
                          alt={project.title}
                          className="project-card-img"
                          loading="lazy"
                          decoding="async"
                          width="380"
                          height="110"
                        />
                        <div className="project-card-img-gradient" />

                        {/* Top Banner Chip */}
                        <div className="project-card-pill-top">
                          <span>{project.eyebrow ? project.eyebrow.split('/')[0].trim() : `0${idx + 1}`}</span>
                          <span className="project-pill-sep">/</span>
                          <span>{project.category}</span>
                        </div>

                        {/* Top-Right Arrow Badge */}
                        <div className="project-card-arrow-badge" title="Open Case Study">
                          <ArrowUpRight size={13} />
                        </div>

                        {/* Metric Ribbon at bottom of thumbnail */}
                        <div className="project-card-metric-pill">
                          {project.metrics ? project.metrics.split('·')[0].trim() : project.category}
                        </div>
                      </div>

                      {/* Bottom Body */}
                      <div className="project-card-body">
                        <div className="project-card-meta-row">
                          <span className="project-category-badge">{project.category}</span>
                          <span className="project-date-eyebrow">{dateLabel}</span>
                        </div>

                        <h3 className="project-card-title">{project.title}</h3>

                        <p className="project-card-desc">{project.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* EDITORIAL LIST VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((project, idx) => (
              <div
                key={project.id}
                className="screen-box"
                onMouseEnter={() => sound.playTick()}
                onClick={() => {
                  sound.playClick();
                  onSelectProject(project);
                }}
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  transition: 'background 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid var(--border-secondary)'
                    }}
                  >
                    <img
                      src={getResponsiveImageUrl(project.image, 120, 75)}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      width="42"
                      height="42"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-family-mono)',
                          color: 'var(--accent)',
                          fontWeight: 600
                        }}
                      >
                        0{idx + 1} / {project.category}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-dim)',
                          fontFamily: 'var(--font-family-mono)'
                        }}
                      >
                        {project.metrics ? project.metrics.split('·')[0].trim() : ''}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginTop: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {project.title}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--accent)',
                      display: 'none'
                    }}
                    className="sm:inline"
                  >
                    Inspect
                  </span>
                  <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scoped CSS for the exact Manish Tamang 3-Card Deck & Physics */}
      <style>{`
        /* Category filter pills - Theme-Adaptive */
        .project-cat-pill {
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-family: var(--font-body);
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.18s ease;
          background: var(--bg-muted);
          color: var(--text-secondary);
          border: 1px solid var(--border-line);
          font-weight: 500;
        }

        .project-cat-pill:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
          border-color: var(--border-glow);
        }

        .project-cat-pill.active {
          background: var(--accent);
          color: #000000 !important;
          border-color: var(--accent);
          font-weight: 600;
          box-shadow: 0 0 12px var(--accent-glow);
        }

        /* Stage container */
        .project-deck-stage {
          position: relative;
          width: 100%;
          border-radius: var(--radius-xl);
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          padding: 24px 20px 0 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        @media (min-width: 768px) {
          .project-deck-stage {
            min-height: auto;
            padding: 38px 20px 0 20px;
          }
        }

        /* Desktop Deck row - Tuck cards into bottom edge */
        .project-deck-row {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-end;
          gap: 12px;
          width: 100%;
          margin-top: 0;
          margin-bottom: -18px; /* Signature reference tuck */
          padding-bottom: 0;
          position: relative;
        }

        @media (max-width: 767px) {
          .project-deck-stage {
            padding: 18px 12px 18px 12px;
            min-height: auto;
          }
          .project-deck-row {
            flex-direction: column;
            align-items: center;
            gap: 16px;
            margin-bottom: 0;
          }
          .project-deck-card {
            width: 100%;
            max-width: 260px;
            height: auto;
            min-height: 220px;
            transform: none !important;
          }
        }

        /* Individual Card Dimensions & Bezier */
        .project-deck-card {
          position: relative;
          width: 215px;
          height: 236px;
          background: var(--bg-surface);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 14px 28px -6px rgba(0, 0, 0, 0.45);
          border: 1px solid var(--border-primary);
          cursor: pointer;
          user-select: none;
          transform-origin: bottom center;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform, box-shadow;
          outline: none;
        }

        /* Base fanned rotations identical to manishtamang.com */
        .project-deck-card.card-left {
          transform: rotate(-3deg);
          z-index: 10;
        }

        .project-deck-card.card-center {
          transform: rotate(1deg);
          z-index: 11;
        }

        .project-deck-card.card-right {
          transform: rotate(3deg);
          z-index: 12;
        }

        /* Card Hover Behavior: Lift up, un-rotate, scale gently, elevated z-index & shadow without clipping */
        .project-deck-card:hover,
        .project-deck-card:focus-visible {
          transform: translateY(-14px) scale(1.02) rotate(0deg) !important;
          z-index: 40 !important;
          border-color: var(--accent-border) !important;
          box-shadow: 0 18px 36px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px var(--accent-glow) !important;
        }

        /* Card Top Thumbnail */
        .project-card-image-box {
          position: relative;
          width: 100%;
          height: 110px;
          border-top-left-radius: 11px;
          border-top-right-radius: 11px;
          overflow: hidden;
          background: var(--bg-muted);
        }

        .project-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 500ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        .project-deck-card:hover .project-card-img {
          transform: scale(1.08);
        }

        .project-card-img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.1) 45%, transparent 100%);
        }

        /* Top Banner Chip */
        .project-card-pill-top {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 3px 8px;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          font-size: 0.65rem;
          font-family: var(--font-family-mono);
          font-weight: 600;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .project-pill-sep {
          opacity: 0.5;
        }

        /* Top Right Arrow */
        .project-card-arrow-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        .project-deck-card:hover .project-card-arrow-badge {
          background: var(--accent);
          color: #000;
          transform: translate(2px, -2px);
        }

        /* Metric Pill at bottom of image */
        .project-card-metric-pill {
          position: absolute;
          bottom: 8px;
          left: 10px;
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--accent);
          font-size: 0.65rem;
          font-family: var(--font-family-mono);
          font-weight: 500;
        }

        /* Bottom Body */
        .project-card-body {
          padding: 10px 13px 8px 13px;
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border-bottom-left-radius: 11px;
          border-bottom-right-radius: 11px;
          border-top: 1px solid var(--border-secondary);
        }

        .project-card-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .project-category-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.60rem;
          font-family: var(--font-family-mono);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--bg-muted);
          color: var(--text-muted);
          border: 1px solid var(--border-secondary);
        }

        .project-date-eyebrow {
          font-size: 0.64rem;
          font-family: var(--font-family-mono);
          color: var(--text-muted);
        }

        .project-card-title {
          font-family: var(--font-heading);
          font-size: 0.90rem;
          font-weight: 600;
          line-height: 1.25;
          color: var(--text-primary);
          margin-top: 2px;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-card-desc {
          font-size: 0.70rem;
          color: var(--text-secondary);
          line-height: 1.35;
          margin-bottom: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          opacity: 0.85;
        }
      `}</style>
    </section>
  );
}
