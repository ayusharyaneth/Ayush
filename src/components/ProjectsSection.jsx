import React, { useState } from 'react';
import {
  ExternalLink,
  Layers,
  List,
  ArrowUpRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { sound } from '../utils/soundEffects';
import { ScrollReveal } from './ScrollReveal';

export default function ProjectsSection({ projects = [], onSelectProject }) {
  const [viewMode, setViewMode] = useState('deck'); // 'deck' (default reference) | 'list'

  // Restrict to exactly 3 projects for the signature 3-card deck
  const deckProjects = projects.slice(0, 3);

  return (
    <section id="work" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <div className="container">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" distance={20} duration={0.6}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '22px'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-family-mono)',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>01 / Selected Work</span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Deck of 3 Releases</span>
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

            {/* View Mode Toggle & Interactive Hint */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className="desktop-hint"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-family-mono)',
                  color: 'var(--text-muted)'
                }}
              >
                <Sparkles size={12} style={{ color: 'var(--accent)' }} />
                <span>Hover card to inspect</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '3px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-secondary)'
                }}
              >
                <button
                  onClick={() => {
                    sound.playClick();
                    setViewMode('deck');
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: viewMode === 'deck' ? 'var(--bg-surface)' : 'transparent',
                    color: viewMode === 'deck' ? 'var(--text-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-family-mono)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Deck view (Reference)"
                  aria-label="Deck view"
                >
                  <Layers size={13} />
                  <span className="hidden sm:inline">Deck</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setViewMode('list');
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-family-mono)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="List view"
                  aria-label="List view"
                >
                  <List size={13} />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3-CARD DECK PRESENTATION (Matching manishtamang.com) */}
        {viewMode === 'deck' ? (
          <ScrollReveal variant="fade-up" distance={24} duration={0.65}>
            <div className="project-deck-stage screen-box">
              {/* Subtle Stage Top Banner / Watermark */}
              <div className="project-stage-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="live-indicator-dot" />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-family-mono)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Interactive Portfolio Deck
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-family-mono)',
                    color: 'var(--text-dim)'
                  }}
                >
                  3 OF 3 DISPLAYED
                </div>
              </div>

              {/* DESKTOP DECK: 3 Fanned Cards (-rotate-3, rotate-1, rotate-3) */}
              <div className="project-deck-row hidden md:flex">
                {deckProjects.map((project, idx) => {
                  const rotationClass =
                    idx === 0 ? 'card-left' : idx === 1 ? 'card-center' : 'card-right';
                  const dateLabel =
                    idx === 0 ? 'v2.4 • Mac' : idx === 1 ? 'v1.8 • AI Studio' : 'v3.2 • OSS';

                  return (
                    <div
                      key={project.id}
                      className={`project-deck-card ${rotationClass} group`}
                      onMouseEnter={() => sound.playWhoosh()}
                      onClick={() => {
                        sound.playPop();
                        onSelectProject(project);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect ${project.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          sound.playPop();
                          onSelectProject(project);
                        }
                      }}
                    >
                      {/* Top Banner Image with Ticket / Sketch Aesthetic */}
                      <div className="project-card-image-box">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="project-card-img"
                          loading="lazy"
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

                        <div className="project-card-footer">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <BookOpen size={12} style={{ color: 'var(--accent)' }} />
                            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              Case study
                            </span>
                          </div>

                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => sound.playClick()}
                                className="project-ext-icon"
                                title="GitHub Repository"
                              >
                                <GithubIcon size={14} />
                              </a>
                            )}
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => sound.playClick()}
                                className="project-ext-icon"
                                title="Live Application"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MOBILE VIEW (< 768px): Sleek Responsive List with Sound Effects */}
              <div className="project-mobile-list flex md:hidden">
                {deckProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="project-mobile-card group"
                    onMouseEnter={() => sound.playWhoosh()}
                    onClick={() => {
                      sound.playPop();
                      onSelectProject(project);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="project-mobile-thumb">
                      <img src={project.image} alt={project.title} loading="lazy" />
                      <div className="project-mobile-thumb-badge">0{idx + 1}</div>
                    </div>

                    <div className="project-mobile-info">
                      <div className="project-mobile-meta">
                        <span className="project-mobile-cat">{project.category}</span>
                        <span className="project-mobile-metric">
                          {project.metrics ? project.metrics.split('·')[0].trim() : ''}
                        </span>
                      </div>
                      <h4 className="project-mobile-title">
                        <span>{project.title}</span>
                        <ArrowUpRight size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      </h4>
                      <p className="project-mobile-desc">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* EDITORIAL LIST VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deckProjects.map((project, idx) => (
              <div
                key={project.id}
                className="screen-box"
                onMouseEnter={() => sound.playWhoosh()}
                onClick={() => {
                  sound.playPop();
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
                      src={project.image}
                      alt={project.title}
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
        /* Stage container */
        .project-deck-stage {
          position: relative;
          width: 100%;
          border-radius: var(--radius-xl);
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          padding: 24px 24px 0 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        @media (min-width: 768px) {
          .project-deck-stage {
            min-height: 480px;
            padding: 28px 32px 0 32px;
          }
        }

        .project-stage-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-secondary);
          margin-bottom: auto;
        }

        .live-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
          display: inline-block;
          animation: pulseGreen 2.5s infinite;
        }

        @keyframes pulseGreen {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.9); }
        }

        /* Desktop Deck row - Tuck cards into bottom edge (-mb-12 like reference) */
        .project-deck-row {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-end;
          gap: 16px;
          width: 100%;
          margin-top: 24px;
          margin-bottom: -46px; /* Signature reference tuck */
          padding-bottom: 0;
          position: relative;
        }

        /* Individual Card Dimensions & Bezier */
        .project-deck-card {
          position: relative;
          width: 270px;
          height: 360px;
          background: var(--bg-surface);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.45);
          border: 1px solid var(--border-primary);
          cursor: pointer;
          user-select: none;
          transform-origin: bottom center;
          transition: all 500ms cubic-bezier(0.23, 1, 0.32, 1);
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

        /* Card Hover Behavior: Lift up, un-rotate, scale, elevated z-index & shadow */
        .project-deck-card:hover,
        .project-deck-card:focus-visible {
          transform: translateY(-38px) scale(1.05) rotate(0deg) !important;
          z-index: 40 !important;
          border-color: var(--accent-border) !important;
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px var(--accent-glow) !important;
        }

        /* Card Top Thumbnail */
        .project-card-image-box {
          position: relative;
          width: 100%;
          height: 148px;
          border-top-left-radius: 13px;
          border-top-right-radius: 13px;
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
          padding: 16px 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border-bottom-left-radius: 13px;
          border-bottom-right-radius: 13px;
          border-top: 1px solid var(--border-secondary);
        }

        .project-card-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .project-category-badge {
          display: inline-block;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 0.64rem;
          font-family: var(--font-family-mono);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--bg-muted);
          color: var(--text-muted);
          border: 1px solid var(--border-secondary);
        }

        .project-date-eyebrow {
          font-size: 0.68rem;
          font-family: var(--font-family-mono);
          color: var(--text-muted);
        }

        .project-card-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.25;
          color: var(--text-primary);
          margin-top: 4px;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-card-desc {
          font-size: 0.76rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          opacity: 0.85;
        }

        .project-card-footer {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid var(--border-secondary);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .project-ext-icon {
          color: var(--text-muted);
          transition: color 0.15s ease, transform 0.15s ease;
          display: inline-flex;
          align-items: center;
        }

        .project-ext-icon:hover {
          color: var(--accent);
          transform: translateY(-1px);
        }

        /* Mobile View (< 768px) */
        .project-mobile-list {
          flex-direction: column;
          gap: 12px;
          width: 100%;
          padding: 16px 0 20px 0;
        }

        .project-mobile-card {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-secondary);
          cursor: pointer;
          transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }

        .project-mobile-card:active {
          transform: scale(0.98);
        }

        .project-mobile-card:hover {
          border-color: var(--border-primary);
          background: var(--bg-muted);
        }

        .project-mobile-thumb {
          position: relative;
          width: 80px;
          height: 64px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid var(--border-secondary);
        }

        .project-mobile-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-mobile-thumb-badge {
          position: absolute;
          bottom: 2px;
          left: 2px;
          background: rgba(0, 0, 0, 0.7);
          padding: 1px 4px;
          border-radius: 3px;
          font-size: 0.58rem;
          font-family: var(--font-family-mono);
          color: #fff;
        }

        .project-mobile-info {
          flex: 1;
          min-width: 0;
        }

        .project-mobile-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .project-mobile-cat {
          font-size: 0.62rem;
          font-family: var(--font-family-mono);
          color: var(--accent);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .project-mobile-metric {
          font-size: 0.62rem;
          font-family: var(--font-family-mono);
          color: var(--text-muted);
        }

        .project-mobile-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1px;
          margin-bottom: 3px;
        }

        .project-mobile-desc {
          font-size: 0.74rem;
          color: var(--text-secondary);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 767px) {
          .desktop-hint {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
