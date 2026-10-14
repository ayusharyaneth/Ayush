import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import TheCollection from './components/TheCollection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Toast from './components/Toast';
import DotGridSpotlight from './components/DotGridSpotlight';
import ScrollEdgeVignettes from './components/ScrollEdgeVignettes';
import GithubHeatmap from './components/GithubHeatmap';
import { ScrollReveal } from './components/ScrollReveal';
import SupportPage from './components/SupportPage';

// Secondary Modals & Drawers: Split into asynchronous chunks to keep initial bundle ultra-light
const SettingsBar = lazy(() => import('./components/SettingsBar'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const CaseStudyModal = lazy(() => import('./components/CaseStudyModal'));

import { portfolioData } from './data/portfolioData';
import { sound } from './utils/soundEffects';
import { haptic } from './utils/haptic';
import { initSmoothScroll, initAnchorScrollListener, smoothScrollTo } from './utils/smoothScroll';

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
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [toast, setToast] = useState(null);
  const [isCopiedActive, setIsCopiedActive] = useState(false);
  const copiedTimerRef = useRef(null);

  // View Routing: 'home' | 'support' (standalone page accessible only via nav/button)
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/support' || hash === '#support') {
        return 'support';
      }
    }
    return 'home';
  });

  // Handle browser Back/Forward buttons and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/support' || hash === '#support') {
        setCurrentView('support');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = useCallback((view, targetSection = '') => {
    setCurrentView(view);
    if (view === 'support') {
      window.history.pushState(null, '', '/support');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.history.pushState(null, '', targetSection ? `#${targetSection}` : '/');
      if (targetSection) {
        setTimeout(() => {
          smoothScrollTo(targetSection);
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }, []);

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
    showToast('Copied', 'copy');

    // Notify mobile dock of active copy action
    setIsCopiedActive(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => {
      setIsCopiedActive(false);
    }, 2200);
  }, [showToast]);

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
    const isModalOpen = Boolean(selectedCaseStudy) || isCommandOpen;
    if (isModalOpen) {
      window.lenis?.stop();
    } else {
      window.lenis?.start();
    }
  }, [selectedCaseStudy, isCommandOpen]);

  // Global Anchor Smooth Scroll Interceptor
  useEffect(() => {
    const unbind = initAnchorScrollListener();
    return () => unbind();
  }, []);

  // Idle prefetch overlay modals for instant response on user interaction
  useEffect(() => {
    const prefetchModals = () => {
      import('./components/CommandPalette');
      import('./components/CaseStudyModal');
      import('./components/SettingsBar');
    };
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(prefetchModals, { timeout: 3000 });
        return () => window.cancelIdleCallback(id);
      } else {
        const timer = setTimeout(prefetchModals, 2000);
        return () => clearTimeout(timer);
      }
    }
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
        onOpenCommand={() => setIsCommandOpen(true)}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
        isSettingsOpen={isSettingsOpen}
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* Mobile Bottom Navigation Pill & Expandable Menu (srbh.site reference) */}
      <MobileBottomNav
        isCopiedActive={isCopiedActive}
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* Header layout spacer so page flow begins naturally beneath fixed navbar on desktop */}
      <div className="navbar-spacer" style={{ height: 'var(--header-height)' }} aria-hidden="true" />

      {/* Floating Interface Customizer Panel (Mukund Kapoor style) */}
      <Suspense fallback={null}>
        {isSettingsOpen && (
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
          />
        )}
      </Suspense>

      {/* Main Content Assembly */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {currentView === 'support' ? (
          <SupportPage
            supportData={portfolioData.support}
            showToast={showToast}
          />
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection
              personal={portfolioData.personal}
              onCopyEmail={handleCopyEmail}
              onNavigateSupport={() => navigateTo('support')}
            />

            {/* Open Source Activity (GitHub Heatmap) */}
            <section id="activity" style={{ paddingTop: '4px', paddingBottom: '24px' }}>
              <div className="container">
                <ScrollReveal variant="fade-up" distance={18} duration={0.65}>
                  <GithubHeatmap />
                </ScrollReveal>
              </div>
            </section>

            {/* Featured Projects Section */}
            <ProjectsSection
              projects={portfolioData.projects}
              onSelectProject={(project) => setSelectedCaseStudy(project)}
            />

            {/* Experience Timeline */}
            <ExperienceSection experience={portfolioData.experience} />

            {/* The Collection: Security Research, Milestones & Writing */}
            <TheCollection collection={portfolioData.theCollection} />

            {/* Contact CTA (Editorial Headline & Graphic Stickers) */}
            <ContactSection
              personal={portfolioData.personal}
              onCopyEmail={handleCopyEmail}
              showToast={showToast}
            />
          </>
        )}
      </main>

      {/* Footer & Signature (Hidden on /support page) */}
      {currentView !== 'support' && (
        <Footer
          personal={portfolioData.personal}
          socials={portfolioData.socials}
        />
      )}

      {/* Secondary Modals & Overlays Wrapped in Suspense */}
      <Suspense fallback={null}>
        {isCommandOpen && (
          <CommandPalette
            isOpen={isCommandOpen}
            setIsOpen={setIsCommandOpen}
            onCopyEmail={handleCopyEmail}
            theme={theme}
            setTheme={handleThemeChange}
            soundMuted={soundMuted}
            setSoundMuted={setSoundMuted}
            projects={portfolioData.projects}
            onOpenCaseStudy={(project) => setSelectedCaseStudy(project)}
            onNavigate={navigateTo}
          />
        )}

        {selectedCaseStudy && (
          <CaseStudyModal
            project={selectedCaseStudy}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}
      </Suspense>

      {/* Instant Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
