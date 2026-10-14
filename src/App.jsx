import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import SettingsBar from './components/SettingsBar';
import CommandPalette from './components/CommandPalette';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import TheCollection from './components/TheCollection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CaseStudyModal from './components/CaseStudyModal';
import Toast from './components/Toast';
import ConsentManager from './components/ConsentManager';
import DotGridSpotlight from './components/DotGridSpotlight';
import ScrollEdgeVignettes from './components/ScrollEdgeVignettes';

import { portfolioData } from './data/portfolioData';
import { sound } from './utils/soundEffects';
import { haptic } from './utils/haptic';
import { initSmoothScroll, initAnchorScrollListener } from './utils/smoothScroll';

export default function App() {
  // Theme & Appearance State
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [font, setFont] = useState(() => localStorage.getItem('portfolio-font') || 'sans');
  const [palette, setPalette] = useState(() => {
    const saved = localStorage.getItem('portfolio-palette');
    if (!saved || saved === 'emerald') return 'azure';
    return saved;
  });
  const [soundMuted, setSoundMuted] = useState(() => sound.isMuted());

  // Modal & Drawer State
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [toast, setToast] = useState(null);
  const [isCopiedActive, setIsCopiedActive] = useState(false);
  const copiedTimerRef = useRef(null);

  // Clean up copied state timer on unmount
  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  // Sync Theme, Font, and Palette to Document Element
  useEffect(() => {
    const html = document.documentElement;
    html.className = `theme-${theme} font-${font} palette-${palette}`;
    html.style.colorScheme = theme === 'dark' ? 'dark' : 'light';

    localStorage.setItem('portfolio-theme', theme);
    localStorage.setItem('portfolio-font', font);
    localStorage.setItem('portfolio-palette', palette);
  }, [theme, font, palette]);

  // Animated Theme Switcher using View Transitions API (Circle Blur Top Left - Chanh Dai)
  const handleThemeChange = useCallback((nextTheme) => {
    const targetTheme = typeof nextTheme === 'function' ? nextTheme(theme) : nextTheme;
    if (targetTheme === theme) return;

    const applyTheme = () => {
      setTheme(targetTheme);
    };

    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  }, [theme]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  const handleCopyEmail = useCallback((targetEmail) => {
    const emailToCopy =
      typeof targetEmail === 'string' && targetEmail
        ? targetEmail
        : portfolioData.personal.chanhCard?.email || portfolioData.personal.email;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(emailToCopy);
      }
    } catch {
      // handled
    }
    haptic(45);
    sound.playSuccess();
    showToast('Copied to clipboard', 'copy');

    // Duck the mobile bottom dock while OS/Toast feedback is active
    setIsCopiedActive(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => {
      setIsCopiedActive(false);
    }, 2200);
  }, [showToast]);

  const handleBookCall = useCallback(() => {
    sound.playClick();
    window.open(portfolioData.personal.calLink, '_blank');
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input or textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      // ⌘K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        setIsCommandOpen((prev) => !prev);
      }

      // 'c' or 'C' -> Copy Email
      if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopyEmail();
      }

      // 'd' or 'D' -> Toggle Dark / Light Theme (with circle blur top left transition)
      if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        sound.playToggle();
        handleThemeChange((prev) => (prev === 'dark' ? 'light' : 'dark'));
        showToast(`Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      }

      // 'm' or 'M' -> Toggle Sound Mute
      if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        const isMuted = sound.toggleMute();
        setSoundMuted(isMuted);
        showToast(isMuted ? 'Interface audio muted' : 'Interface audio enabled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopyEmail, theme, showToast, handleThemeChange]);

  // Initialize Lenis Smooth Scrolling (ossium.in inertial scroll engine)
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return () => cleanup?.();
  }, []);

  // Pause Lenis smooth scroll while blocking modal dialogs are open
  useEffect(() => {
    const isModalOpen = Boolean(selectedCaseStudy) || isConsentOpen || isCommandOpen;
    if (isModalOpen) {
      window.lenis?.stop();
    } else {
      window.lenis?.start();
    }
  }, [selectedCaseStudy, isConsentOpen, isCommandOpen]);

  // Global Anchor Smooth Scroll Interceptor
  useEffect(() => {
    const unbind = initAnchorScrollListener();
    return () => unbind();
  }, []);

  return (
    <div className="bg-schematic-grid" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Interactive Dot Grid Spotlight Canvas (Chanh Dai) */}
      <DotGridSpotlight theme={theme} />

      {/* Subtle Adaptive Scroll Edge Vignettes (Top & Bottom Blur) */}
      <ScrollEdgeVignettes />

      {/* Sticky Navigation Bar (Desktop) */}
      <Navbar
        theme={theme}
        setTheme={handleThemeChange}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        onOpenCommand={() => setIsCommandOpen(true)}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
        isSettingsOpen={isSettingsOpen}
      />

      {/* Mobile Bottom Navigation Pill & Expandable Menu (srbh.site reference) */}
      <MobileBottomNav isCopiedActive={isCopiedActive} />

      {/* Header layout spacer so page flow begins naturally beneath fixed navbar on desktop */}
      <div className="navbar-spacer" style={{ height: 'var(--header-height)' }} aria-hidden="true" />

      {/* Floating Interface Customizer Panel (Mukund Kapoor style) */}
      <SettingsBar
        theme={theme}
        setTheme={handleThemeChange}
        font={font}
        setFont={setFont}
        palette={palette}
        setPalette={setPalette}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        onOpenConsent={() => setIsConsentOpen(true)}
      />

      {/* Main Content Assembly */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <HeroSection
          personal={portfolioData.personal}
          onCopyEmail={handleCopyEmail}
          onBookCall={handleBookCall}
        />

        {/* Featured Projects Section */}
        <ProjectsSection
          projects={portfolioData.projects}
          onSelectProject={(project) => setSelectedCaseStudy(project)}
        />

        {/* Experience Timeline & GitHub 52-Week Activity */}
        <ExperienceSection experience={portfolioData.experience} />

        {/* The Collection: Security Research, Milestones & Writing */}
        <TheCollection collection={portfolioData.theCollection} />

        {/* Contact CTA */}
        <ContactSection
          personal={portfolioData.personal}
          socials={portfolioData.socials}
          onCopyEmail={handleCopyEmail}
          onBookCall={handleBookCall}
        />
      </main>

      {/* Footer & Signature */}
      <Footer
        personal={portfolioData.personal}
        socials={portfolioData.socials}
        onOpenConsent={() => setIsConsentOpen(true)}
      />

      {/* Command Palette Modal (⌘K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        setIsOpen={setIsCommandOpen}
        onCopyEmail={handleCopyEmail}
        theme={theme}
        setTheme={handleThemeChange}
        font={font}
        setFont={setFont}
        palette={palette}
        setPalette={setPalette}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        projects={portfolioData.projects}
        onOpenCaseStudy={(project) => setSelectedCaseStudy(project)}
        onOpenConsent={() => setIsConsentOpen(true)}
      />

      {/* Case Study Deep Dive Modal */}
      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />

      {/* Cookie & Telemetry Consent Manager (c15t / Chanh Dai) */}
      <ConsentManager
        isOpen={isConsentOpen}
        setIsOpen={setIsConsentOpen}
        onShowToast={showToast}
      />

      {/* Instant Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
