import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Disc3, Music2, Volume2, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function VinylPlayer({ tracks = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const activeTrack = tracks[currentTrackIndex] || {
    title: 'Midnight Rain',
    artist: 'Lofi Study Beats',
    genre: 'Ambient Lofi'
  };

  const lofiPlayerRef = useRef(null);

  const togglePlayback = () => {
    sound.playClick();
    if (isPlaying) {
      if (lofiPlayerRef.current) {
        lofiPlayerRef.current.stop();
        lofiPlayerRef.current = null;
      }
      setIsPlaying(false);
    } else {
      lofiPlayerRef.current = sound.createLofiPlayer(activeTrack.frequencies, activeTrack.bpm);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    sound.playClick();
    if (lofiPlayerRef.current) {
      lofiPlayerRef.current.stop();
    }
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);

    if (isPlaying) {
      const nextTrack = tracks[nextIdx];
      lofiPlayerRef.current = sound.createLofiPlayer(nextTrack.frequencies, nextTrack.bpm);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lofiPlayerRef.current) {
        lofiPlayerRef.current.stop();
      }
    };
  }, []);

  return (
    <div
      className="screen-box"
      style={{
        padding: '16px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Left: Turntable & Vinyl Disc */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Vinyl Disc Container */}
          <div
            onClick={togglePlayback}
            style={{
              position: 'relative',
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: '#09090b',
              boxShadow: isPlaying
                ? '0 0 16px var(--accent-glow), 0 4px 12px rgba(0,0,0,0.5)'
                : '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.15)',
              transition: 'box-shadow 0.3s ease'
            }}
            title="Click to toggle ambient audio"
          >
            {/* Spinning Groove Rings */}
            <div
              style={{
                position: 'absolute',
                inset: '4px',
                borderRadius: '50%',
                border: '1px dashed rgba(255,255,255,0.2)',
                animation: isPlaying ? 'spinVinyl 3s linear infinite' : 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                animation: isPlaying ? 'spinVinyl 3s linear infinite' : 'none'
              }}
            />

            {/* Center Label */}
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.4)',
                animation: isPlaying ? 'spinVinyl 3s linear infinite' : 'none'
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#09090b'
                }}
              />
            </div>

            {/* Play/Pause Overlay Icon on hover */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.35)',
                color: '#fff',
                opacity: isPlaying ? 0 : 0.9,
                transition: 'opacity 0.2s ease'
              }}
            >
              <Play size={14} fill="#fff" style={{ marginLeft: '2px' }} />
            </div>
          </div>

          {/* Track Metadata */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-family-mono)',
                  color: isPlaying ? 'var(--accent)' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
              >
                {isPlaying ? '● Playing Synthesizer' : '○ Turntable Idle'}
              </span>

              {/* Animated Waveform Visualizer */}
              <div className={`waveform-bars ${isPlaying ? 'waveform-playing' : ''}`}>
                <span className="waveform-bar" style={{ height: isPlaying ? '60%' : '20%' }} />
                <span className="waveform-bar" style={{ height: isPlaying ? '80%' : '30%' }} />
                <span className="waveform-bar" style={{ height: isPlaying ? '50%' : '15%' }} />
                <span className="waveform-bar" style={{ height: isPlaying ? '90%' : '25%' }} />
                <span className="waveform-bar" style={{ height: isPlaying ? '40%' : '20%' }} />
              </div>
            </div>

            <div
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '2px'
              }}
            >
              {activeTrack.title}
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}
            >
              {activeTrack.artist} · <span style={{ color: 'var(--text-muted)' }}>{activeTrack.genre}</span>
            </div>
          </div>
        </div>

        {/* Right: Audio Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={togglePlayback}
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.8rem', gap: '6px' }}
          >
            {isPlaying ? (
              <>
                <Pause size={14} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span>Play Sound</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextTrack}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Next ambient track"
            aria-label="Next track"
          >
            <SkipForward size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spinVinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
