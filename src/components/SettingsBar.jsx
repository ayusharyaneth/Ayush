import React from 'react';
import { Sun, Moon, Volume2, VolumeX, Type, Palette, Sliders, Check, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function SettingsBar({
  theme,
  setTheme,
  font,
  setFont,
  palette,
  setPalette,
  soundMuted,
  setSoundMuted,
  isOpen,
  setIsOpen,
  onOpenConsent
}) {
  const themes = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun }
  ];

  const fonts = [
    { id: 'sans', label: 'Sans', preview: 'Inter' },
    { id: 'serif', label: 'Serif', preview: 'Instrument' },
    { id: 'mono', label: 'Mono', preview: 'Plex Mono' }
  ];

  const palettes = [
    { id: 'azure', label: 'Azure', color: '#0ea5e9' },
    { id: 'violet', label: 'Violet', color: '#8b5cf6' },
    { id: 'amber', label: 'Amber', color: '#f59e0b' },
    { id: 'rose', label: 'Rose', color: '#f43f5e' },
    { id: 'monochrome', label: 'Mono', color: '#a1a1aa' }
  ];

  const handleSoundToggle = () => {
    const isMuted = sound.toggleMute();
    setSoundMuted(isMuted);
    if (!isMuted) sound.playClick();
  };

  const handleThemeChange = (newTheme) => {
    sound.playToggle();
    setTheme(newTheme);
  };

  const handleFontChange = (newFont) => {
    sound.playClick();
    setFont(newFont);
  };

  const handlePaletteChange = (newPalette) => {
    sound.playClick();
    setPalette(newPalette);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '64px',
        right: '20px',
        zIndex: 90,
        width: '300px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-popover)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '16px',
        color: 'var(--text-primary)',
        animation: 'slideUpFade 0.25s var(--ease-spring)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Sliders size={15} style={{ color: 'var(--accent)' }} />
          <span>Interface Customizer</span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(false);
          }}
          style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px' }}
        >
          Done
        </button>
      </div>

      {/* Theme Mode */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Color Appearance
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {themes.map((t) => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  background: active ? 'var(--accent-tint)' : 'var(--bg-muted)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border-secondary)'}`,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 400
                }}
              >
                <Icon size={13} style={{ color: active ? 'var(--accent)' : 'inherit' }} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Typographic Rhythm
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {fonts.map((f) => {
            const active = font === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleFontChange(f.id)}
                style={{
                  padding: '6px 4px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  background: active ? 'var(--accent-tint)' : 'var(--bg-muted)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border-secondary)'}`,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textAlign: 'center',
                  fontWeight: active ? 600 : 400
                }}
              >
                <div>{f.label}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{f.preview}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Palette */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Accent Hue
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
          {palettes.map((p) => {
            const active = palette === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePaletteChange(p.id)}
                title={p.label}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: p.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                  boxShadow: active ? `0 0 10px ${p.color}` : 'none',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.15s ease'
                }}
              >
                {active && <Check size={14} color="#000" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Sound Engine */}
      <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 500 }}>Interface Audio</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Synthesized haptic sound cues</div>
        </div>
        <button
          onClick={handleSoundToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            background: soundMuted ? 'var(--bg-muted)' : 'var(--accent-tint)',
            border: `1px solid ${soundMuted ? 'var(--border-secondary)' : 'var(--accent)'}`,
            color: soundMuted ? 'var(--text-muted)' : 'var(--text-primary)'
          }}
        >
          {soundMuted ? <VolumeX size={13} /> : <Volume2 size={13} style={{ color: 'var(--accent)' }} />}
          <span>{soundMuted ? 'Muted' : 'Enabled'}</span>
        </button>
      </div>

      {/* Privacy & Consent Manager Trigger */}
      {onOpenConsent && (
        <div style={{ paddingTop: '10px', borderTop: '1px dashed var(--border-dashed)' }}>
          <button
            onClick={() => {
              sound.playClick();
              onOpenConsent();
              setIsOpen(false);
            }}
            className="btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '7px 12px',
              fontSize: '0.75rem',
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
            <span>Manage Cookie Consent</span>
          </button>
        </div>
      )}
    </div>
  );
}
