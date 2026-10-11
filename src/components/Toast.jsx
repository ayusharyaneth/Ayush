import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glow)',
        boxShadow: 'var(--shadow-popover)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: 'var(--text-primary)',
        fontSize: '0.85rem'
      }}
      className="toast-enter"
    >
      <span style={{ color: 'var(--accent)', display: 'flex' }}>
        {toast.type === 'copy' ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
      </span>
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: '4px',
          color: 'var(--text-muted)',
          display: 'flex',
          padding: '2px',
          borderRadius: '4px'
        }}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
