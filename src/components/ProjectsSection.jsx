import React, { useState } from 'react';
import {
  ExternalLink,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { sound } from '../utils/soundEffects';
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';
import { GlowCardGrid, GlowCardOverlay } from './GlowCardGrid';

export default function ProjectsSection({ projects = [], onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const categories = ['All', 'Full-Stack', 'AI & ML', 'Systems', 'Open Source'];

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" style={{ paddingTop: '28px', paddingBottom: '28px' }}>
      <div className="container">
        {/* Section Header with Editorial Serif Flourish */}
        <ScrollReveal variant="fade-up" distance={20} duration={0.6}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px'
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
                  fontWeight: 600
                }}
              >
                01 / Selected Work
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
                <span style={{ fontFamily: 'var(--font-family-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                  Crafted with care.
                </span>
              </h2>
            </div>

            {/* View Mode Toggle & Category Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    setViewMode('grid');
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <LayoutGrid size={14} />
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
                    alignItems: 'center'
                  }}
                  title="List view"
                  aria-label="List view"
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Pills Bar */}
        <ScrollReveal variant="fade-up" distance={14} delay={0.06} duration={0.55}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '28px',
              scrollbarWidth: 'none'
            }}
          >
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory(cat);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-family-mono)',
                    whiteSpace: 'nowrap',
                    background: active ? 'var(--accent)' : 'var(--bg-muted)',
                    color: active ? '#000' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-secondary)'}`,
                    fontWeight: active ? 600 : 400,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Projects Grid Container with Chanh Dai Glow Card Animation */}
        {viewMode === 'grid' ? (
          <GlowCardGrid>
            <ScrollRevealGroup
              key={`grid-${activeCategory}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '24px'
              }}
              className="projects-grid"
              stagger={0.07}
            >
              {filtered.map((project) => (
                <ScrollRevealItem
                  key={project.id}
                  as="article"
                  data-slot="glow-card"
                  className="screen-box"
                  distance={20}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  {/* Chanh Dai Glow Card Ambient and Border Refraction Overlay */}
                  <GlowCardOverlay image={project.image} title={project.title} />

                  <div className="glow-card-content">
                    {/* Visual Thumbnail */}
                    <div
                      onClick={() => {
                        sound.playClick();
                        onSelectProject(project);
                      }}
                      style={{
                        position: 'relative',
                        height: '200px',
                        width: '100%',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: 'var(--bg-surface)'
                      }}
                    >
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s var(--ease-spring)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {/* Category Pill Over Image */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-family-mono)',
                      border: '1px solid rgba(255,255,255,0.15)'
                    }}
                  >
                    {project.category}
                  </div>

                  {/* Impact Metric Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-card)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--accent)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      fontFamily: 'var(--font-family-mono)',
                      border: '1px solid var(--border-glow)'
                    }}
                  >
                    {project.metrics}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-family-mono)',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase'
                      }}
                    >
                      {project.eyebrow}
                    </div>

                    <h3
                      onClick={() => {
                        sound.playClick();
                        onSelectProject(project);
                      }}
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight size={16} style={{ color: 'var(--accent)' }} />
                    </h3>

                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        marginTop: '8px',
                        marginBottom: '16px'
                      }}
                    >
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="tech-tag">+{project.technologies.length - 4}</span>
                      )}
                    </div>

                    {/* Bottom Action Links */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-secondary)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <button
                        onClick={() => {
                          sound.playClick();
                          onSelectProject(project);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: 'var(--text-primary)',
                          fontWeight: 500
                        }}
                      >
                        <BookOpen size={13} style={{ color: 'var(--accent)' }} />
                        <span>Case study</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => sound.playClick()}
                            style={{ color: 'var(--text-muted)' }}
                            title="GitHub Repository"
                          >
                            <GithubIcon size={15} />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => sound.playClick()}
                            style={{ color: 'var(--text-muted)' }}
                            title="Live Application"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        ) : (
          /* List View */
          <ScrollRevealGroup
            key={`list-${activeCategory}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            stagger={0.05}
          >
            {filtered.map((project) => (
              <ScrollRevealItem
                key={project.id}
                as="div"
                className="screen-box"
                distance={16}
                onClick={() => {
                  sound.playClick();
                  onSelectProject(project);
                }}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: 'var(--accent)' }}>
                      {project.eyebrow}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {project.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {project.tagline}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--accent)',
                      display: 'none'
                    }}
                    className="list-metric"
                  >
                    {project.metrics}
                  </span>
                  <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
