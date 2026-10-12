import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
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

import { portfolioData } from './data/portfolioData';
import { sound } from './utils/soundEffects';

export default function App() {
  // Theme & Appearance State
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [font, setFont] = useState(() => localStorage.getItem('portfolio-font') || 'sans');
  const [palette, setPalette] = useState(() => localStorage.getItem('portfolio-palette') || 'emerald');
  const [soundMuted, setSoundMuted] = useState(() => sound.isMuted());

  // Modal & Drawer State
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync Theme, Font, and Palette to Document Element
  useEffect(() => {
    const html = document.documentElement;
    html.className = `theme-${theme} font-${font} palette-${palette}`;
    html.style.colorScheme = theme === 'dark' ? 'dark' : 'light';

    localStorage.setItem('portfolio-theme', theme);
    localStorage.setItem('portfolio-font', font);
    localStorage.setItem('portfolio-palette', palette);
  }, [theme, font, palette]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    sound.playSuccess();
    showToast(`Copied ${portfolioData.personal.email} to clipboard!`, 'copy');
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

      // 'd' or 'D' -> Toggle Dark / Light Theme
      if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        sound.playToggle();
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
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
  }, [handleCopyEmail, theme, showToast]);

  return (
    <div className="bg-schematic-grid" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Sticky Navigation Bar */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        onOpenCommand={() => setIsCommandOpen(true)}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
        isSettingsOpen={isSettingsOpen}
      />

      {/* Floating Interface Customizer Panel (Mukund Kapoor style) */}
      <SettingsBar
        theme={theme}
        setTheme={setTheme}
        font={font}
        setFont={setFont}
        palette={palette}
        setPalette={setPalette}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />

      {/* Main Content Assembly */}
      <main>
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

        {/* Contact CTA & Vinyl Turntable Station */}
        <ContactSection
          personal={portfolioData.personal}
          socials={portfolioData.socials}
          musicTracks={portfolioData.musicTracks}
          onCopyEmail={handleCopyEmail}
          onBookCall={handleBookCall}
        />
      </main>

      {/* Footer & Signature */}
      <Footer personal={portfolioData.personal} />

      {/* Command Palette Modal (⌘K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        setIsOpen={setIsCommandOpen}
        onCopyEmail={handleCopyEmail}
        theme={theme}
        setTheme={setTheme}
        font={font}
        setFont={setFont}
        palette={palette}
        setPalette={setPalette}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        projects={portfolioData.projects}
        onOpenCaseStudy={(project) => setSelectedCaseStudy(project)}
      />

      {/* Case Study Deep Dive Modal */}
      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />

      {/* Instant Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
