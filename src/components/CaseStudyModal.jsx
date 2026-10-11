import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, Cpu, BarChart3, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';
import { sound } from '../utils/soundEffects';

export default function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-popover)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          color: 'var(--text-primary)',
          padding: '32px 28px',
          animation: 'slideUpFade 0.25s var(--ease-spring)'
        }}
      >
        {/* Modal Top Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>
              {project.eyebrow}
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '2px' }}>
              {project.title}
            </h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {project.tagline}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
            aria-label="Close case study"
          >
            <X size={18} />
          </button>
        </div>

        {/* Project Visual Image */}
        <div
          style={{
            width: '100%',
            height: '240px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-primary)',
            marginBottom: '24px',
            position: 'relative'
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Impact Highlights */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-tint)',
            border: '1px solid var(--accent)',
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}
        >
          <BarChart3 size={16} style={{ color: 'var(--accent)' }} />
          <span>{project.metrics}</span>
        </div>

        {/* Deep Dive Grid: Problem, Solution, Outcome */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--accent)' }}>01.</span> The Challenge & Context
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {project.caseStudy?.problem || project.description}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--accent)' }}>02.</span> Architecture & Engineering Solution
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {project.caseStudy?.solution || project.description}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--accent)' }}>03.</span> Measurable Impact & Milestones
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {project.caseStudy?.outcome || project.metrics}
            </p>
          </div>
        </div>

        {/* Tech Stack List */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Built With
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.technologies.map((t) => (
              <span key={t} className="tech-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-secondary)' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              className="btn-secondary"
            >
              <GithubIcon size={14} />
              <span>Source Repository</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              className="btn-primary"
            >
              <span>Explore Live</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
