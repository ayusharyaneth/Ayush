import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check, Lock, Activity, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import './ConsentManager.css';

const CONSENT_STORAGE_KEY = 'portfolio-consent-settings';

const DEFAULT_SETTINGS = {
  necessary: true,
  measurement: true,
  personalization: true,
  decided: false,
  timestamp: null
};

export default function ConsentManager({
  isOpen,
  setIsOpen,
  onShowToast
}) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [draftSettings, setDraftSettings] = useState({
    measurement: settings.measurement,
    personalization: settings.personalization
  });

  const [showBanner, setShowBanner] = useState(!settings.decided);

  useEffect(() => {
    if (isOpen) {
      setDraftSettings({
        measurement: settings.measurement,
        personalization: settings.personalization
      });
    }
  }, [isOpen, settings]);

  const saveConsent = (updated) => {
    const finalSettings = {
      ...updated,
      necessary: true,
      decided: true,
      timestamp: new Date().toISOString()
    };
    setSettings(finalSettings);
    setShowBanner(false);
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(finalSettings));
    } catch {
      // ignore storage failure
    }
  };

  const handleAcceptAll = () => {
    sound.playSuccess();
    saveConsent({
      necessary: true,
      measurement: true,
      personalization: true
    });
    if (setIsOpen) setIsOpen(false);
    if (onShowToast) onShowToast('All cookie preferences accepted', 'success');
  };

  const handleRejectNonEssential = () => {
    sound.playToggle();
    saveConsent({
      necessary: true,
      measurement: false,
      personalization: false
    });
    if (setIsOpen) setIsOpen(false);
    if (onShowToast) onShowToast('Non-essential tracking declined', 'info');
  };

  const handleSaveCustom = () => {
    sound.playSuccess();
    saveConsent({
      necessary: true,
      measurement: draftSettings.measurement,
      personalization: draftSettings.personalization
    });
    if (setIsOpen) setIsOpen(false);
    if (onShowToast) onShowToast('Custom privacy preferences saved', 'success');
  };

  const handleOpenPreferences = () => {
    sound.playClick();
    if (setIsOpen) setIsOpen(true);
  };

  const toggleDraft = (key) => {
    sound.playToggle();
    setDraftSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {/* Floating Cookie Banner (Shown on first visit or until decided) */}
      {showBanner && !isOpen && (
        <aside className="consent-banner-wrapper" aria-label="Cookie and Privacy Consent">
          <div className="consent-banner-card">
            <div className="consent-banner-header">
              <div className="consent-banner-icon-badge">
                <Cookie size={18} />
              </div>
              <div>
                <div className="consent-banner-title">
                  <span>Cookie Preferences</span>
                  <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-muted)', border: '1px solid var(--border-secondary)', color: 'var(--text-muted)' }}>
                    c15t
                  </span>
                </div>
                <p className="consent-banner-desc">
                  We use cookies and offline storage to preserve your theme, audio settings, and interaction analytics to deliver a handcrafted portfolio experience.
                </p>
              </div>
            </div>

            <div className="consent-banner-actions">
              <button
                onClick={handleAcceptAll}
                className="consent-btn-accept"
                title="Accept all cookies and analytics"
              >
                <Check size={14} />
                <span>Accept all</span>
              </button>

              <button
                onClick={handleRejectNonEssential}
                className="consent-btn-reject"
                title="Reject non-essential tracking"
              >
                Reject non-essential
              </button>

              <button
                onClick={handleOpenPreferences}
                className="consent-btn-manage"
                title="Customize consent preferences"
              >
                Customize
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Deep-Dive Consent Manager Modal (Inspired by Chanh Dai) */}
      {isOpen && (
        <div
          className="consent-modal-overlay"
          onClick={() => {
            sound.playClick();
            if (setIsOpen) setIsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-modal-title"
        >
          <div className="consent-modal-card scroll-fade-effect-y" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="consent-modal-header">
              <div className="consent-modal-header-info">
                <div id="consent-modal-title" className="consent-modal-title">
                  <ShieldCheck size={20} style={{ color: 'var(--accent)' }} />
                  <span>Cookie & Tracking Preferences</span>
                </div>
                <p className="consent-modal-subtitle">
                  Configure the consent options for local storage and telemetry on this site.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  if (setIsOpen) setIsOpen(false);
                }}
                className="consent-modal-close"
                aria-label="Close consent dialog"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Categories */}
            <div className="consent-modal-body">
              {/* Category 1: Strictly Necessary */}
              <div className="consent-category-card">
                <div className="consent-category-header">
                  <div className="consent-category-info">
                    <Lock size={15} style={{ color: 'var(--accent)' }} />
                    <span className="consent-category-title">Strictly Necessary</span>
                  </div>
                  <span className="consent-badge-locked">Always Active</span>
                </div>
                <p className="consent-category-desc">
                  Required for essential website operation, theme persistence (dark/light), sound synthesis preference, and saving your consent choice.
                </p>
                <div className="consent-category-tags">
                  <span className="consent-tag">portfolio-theme</span>
                  <span className="consent-tag">portfolio-font</span>
                  <span className="consent-tag">portfolio-sound-muted</span>
                  <span className="consent-tag">portfolio-consent-settings</span>
                </div>
              </div>

              {/* Category 2: Measurement & Analytics */}
              <div className="consent-category-card">
                <div className="consent-category-header">
                  <div className="consent-category-info">
                    <Activity size={15} style={{ color: 'var(--text-secondary)' }} />
                    <span className="consent-category-title">Measurement & Telemetry</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleDraft('measurement')}
                    className={`consent-switch ${draftSettings.measurement ? 'active' : ''}`}
                    aria-label="Toggle measurement cookies"
                  >
                    <span className="consent-switch-thumb" />
                  </button>
                </div>
                <p className="consent-category-desc">
                  Gathers aggregate, privacy-preserving telemetry on section scroll depth and interaction speed to help optimize interface performance.
                </p>
                <div className="consent-category-tags">
                  <span className="consent-tag">session_views</span>
                  <span className="consent-tag">interaction_latency</span>
                </div>
              </div>

              {/* Category 3: Experience & Personalization */}
              <div className="consent-category-card">
                <div className="consent-category-header">
                  <div className="consent-category-info">
                    <Sparkles size={15} style={{ color: 'var(--accent)' }} />
                    <span className="consent-category-title">Experience & Personalization</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleDraft('personalization')}
                    className={`consent-switch ${draftSettings.personalization ? 'active' : ''}`}
                    aria-label="Toggle personalization cookies"
                  >
                    <span className="consent-switch-thumb" />
                  </button>
                </div>
                <p className="consent-category-desc">
                  Preserves interactive sound preferences, schematic particle speed settings, and command palette search history.
                </p>
                <div className="consent-category-tags">
                  <span className="consent-tag">sound_effects</span>
                  <span className="consent-tag">canvas_particles</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="consent-modal-footer">
              <span className="consent-modal-footer-left">
                Powered by c15t architecture
              </span>

              <div className="consent-modal-footer-actions">
                <button
                  onClick={handleRejectNonEssential}
                  className="btn-secondary"
                  style={{ height: '34px', fontSize: '0.78rem', padding: '0 12px' }}
                >
                  Reject non-essential
                </button>

                <button
                  onClick={handleSaveCustom}
                  className="btn-primary"
                  style={{ height: '34px', fontSize: '0.78rem', padding: '0 16px', gap: '6px' }}
                >
                  <Check size={14} />
                  <span>Save preferences</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
