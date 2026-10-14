import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      className="app-toast-container"
      role="status"
      aria-live="polite"
    >
      <span className="app-toast-icon">
        {toast.type === 'copy' ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
      </span>
      <span className="app-toast-message">{toast.message}</span>
      <button
        onClick={onClose}
        className="app-toast-close"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
