/**
 * Smooth Scrolling Controller for Antigravity Portfolio
 * 
 * Powered by Lenis (the exact buttery-smooth inertial scroll engine behind ossium.in).
 * Features:
 * - Exponential decay easing with organic deceleration on wheel/touchpad
 * - Zero lag native 1:1 touch preservation on mobile (syncTouch: false)
 * - Automatic prevention inside scrollable modals, command palette, and code blocks
 * - Seamless integration with sticky header offsets (72px desktop, 20px mobile)
 * - Full prefers-reduced-motion accessibility compliance and graceful RAF fallback
 */

import Lenis from 'lenis';

let lenisInstance = null;
let activeAnimationId = null;
let activeInterruptHandler = null;

/**
 * Access the active Lenis smooth scroll instance
 */
export function getLenis() {
  return lenisInstance;
}

/**
 * Calculates the ideal top offset based on current viewport geometry.
 */
export function getHeaderOffset() {
  if (typeof window === 'undefined') return 72;
  const isMobile = window.innerWidth <= 720;
  if (isMobile) {
    // Mobile bottom dock is at the bottom; give a comfortable 20px padding at top
    return 20;
  }
  // Desktop header: 56px height + 12px floating dock margin + 4px breathing room
  return 72;
}

/**
 * Natural cubic-bezier easing curve (easeInOutCubic) for fallback animation
 */
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Initialize Lenis smooth scroll engine (matching ossium.in)
 * 
 * @returns {Function} cleanup function to destroy the instance
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return () => {};

  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  // If already initialized, return cleanup
  if (lenisInstance) {
    return () => {
      lenisInstance?.destroy();
      lenisInstance = null;
      if (typeof window !== 'undefined') window.lenis = null;
    };
  }

  try {
    // Exact configuration matching ossium.in:
    // - duration: 1.1s
    // - easing: 1 - 2^(-10t) exponential deceleration
    // - smoothWheel: true
    // - syncTouch: false (native responsive touch feel)
    // - autoRaf: true (built-in RAF loop)
    // - prevent: ignores wheel on modals, popovers, and inner scrollable regions
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
      anchors: false, // delegated to initAnchorScrollListener for responsive header offsets
      prevent: (node) => {
        if (!node || !(node instanceof Element)) return false;
        return Boolean(
          node.closest(
            '.overflow-y-auto, .overflow-y-scroll, .overflow-auto, .overflow-scroll, [data-lenis-prevent], [data-lenis-prevent-wheel], [data-lenis-prevent-touch]'
          )
        );
      }
    });

    lenisInstance = lenis;
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      lenisInstance = null;
      window.lenis = null;
    };
  } catch (err) {
    console.warn('[SmoothScroll] Failed to initialize Lenis, falling back to RAF:', err);
    return () => {};
  }
}

/**
 * Cancels any in-progress smooth scroll immediately.
 */
export function cancelSmoothScroll() {
  if (lenisInstance) {
    // Halts active programmatic scroll smoothly
    lenisInstance.stop();
    lenisInstance.start();
  }
  if (activeAnimationId !== null) {
    cancelAnimationFrame(activeAnimationId);
    activeAnimationId = null;
  }
  if (activeInterruptHandler) {
    activeInterruptHandler();
    activeInterruptHandler = null;
  }
}

/**
 * Smoothly scrolls the window to a specified section, element, or Y position.
 * Uses Lenis when available, with a high-fidelity cubic bezier fallback.
 * 
 * @param {string|number|HTMLElement} target - Section ID ('top', 'work', etc.), pixel coordinate, or element
 * @param {Object} [options]
 * @param {number} [options.offset] - Custom top offset in pixels
 * @param {number} [options.duration] - Optional custom animation duration in ms
 * @param {Function} [options.onComplete] - Callback executed upon reaching destination
 * @param {Function} [options.onInterrupt] - Callback executed if user cancels via touch/wheel
 * @param {boolean} [options.immediate] - Jump directly to target
 * @returns {Promise<void>}
 */
export function smoothScrollTo(target, options = {}) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const headerOffset = options.offset !== undefined ? options.offset : getHeaderOffset();
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion: jump immediately
    if (prefersReducedMotion || options.immediate) {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'auto' });
      } else if (target === 'top' || target === '#top' || target === '#') {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        const elementId = typeof target === 'string' ? target.replace(/^#/, '') : null;
        const element = elementId
          ? document.getElementById(elementId)
          : (target instanceof HTMLElement ? target : null);

        if (element) {
          const rect = element.getBoundingClientRect();
          window.scrollTo({ top: rect.top + window.scrollY - headerOffset, behavior: 'auto' });
        } else {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      }
      options.onComplete?.();
      resolve();
      return;
    }

    // PRIMARY PATH: Lenis Smooth Scroll Engine (ossium.in)
    if (lenisInstance) {
      let resolvedTarget;
      let computedOffset = -headerOffset;

      if (typeof target === 'number') {
        resolvedTarget = target;
        computedOffset = 0;
      } else if (target === 'top' || target === '#top' || target === '#') {
        resolvedTarget = 0;
        computedOffset = 0;
      } else if (typeof target === 'string') {
        const elementId = target.replace(/^#/, '');
        resolvedTarget = document.getElementById(elementId) || target;
      } else {
        resolvedTarget = target;
      }

      lenisInstance.scrollTo(resolvedTarget, {
        offset: computedOffset,
        duration: options.duration ? options.duration / 1000 : 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        immediate: false,
        onComplete: () => {
          options.onComplete?.();
          resolve();
        }
      });
      return;
    }

    // FALLBACK PATH: Physics-based Cubic Bezier Animation Loop
    let targetY = 0;
    if (typeof target === 'number') {
      targetY = target;
    } else if (target === 'top' || target === '#top' || target === '#') {
      targetY = 0;
    } else {
      const elementId = typeof target === 'string' ? target.replace(/^#/, '') : null;
      const element = elementId
        ? document.getElementById(elementId)
        : (target instanceof HTMLElement ? target : null);

      if (element) {
        const rect = element.getBoundingClientRect();
        targetY = rect.top + window.scrollY - headerOffset;
      } else {
        targetY = 0;
      }
    }

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    targetY = Math.max(0, Math.min(targetY, maxScroll));

    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      options.onComplete?.();
      resolve();
      return;
    }

    cancelSmoothScroll();

    const duration = options.duration || Math.min(
      850,
      Math.max(450, Math.round(Math.sqrt(Math.abs(distance)) * 22))
    );

    let startTime = null;
    const root = document.documentElement;
    const prevScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    const cleanup = () => {
      window.removeEventListener('wheel', handleInterrupt);
      window.removeEventListener('touchmove', handleInterrupt);
      window.removeEventListener('keydown', handleKeyInterrupt);
      root.style.scrollBehavior = prevScrollBehavior;
      activeAnimationId = null;
      activeInterruptHandler = null;
    };

    const handleInterrupt = () => {
      cleanup();
      options.onInterrupt?.();
      resolve();
    };

    const handleKeyInterrupt = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'].includes(e.code)) {
        handleInterrupt();
      }
    };

    window.addEventListener('wheel', handleInterrupt, { passive: true });
    window.addEventListener('touchmove', handleInterrupt, { passive: true });
    window.addEventListener('keydown', handleKeyInterrupt, { passive: true });

    activeInterruptHandler = handleInterrupt;

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeInOutCubic(progress);

      const currentY = Math.round(startY + distance * easedProgress);
      window.scrollTo(0, currentY);

      if (progress < 1) {
        activeAnimationId = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        cleanup();
        options.onComplete?.();
        resolve();
      }
    };

    activeAnimationId = requestAnimationFrame(step);
  });
}

/**
 * Attaches a delegated click handler for in-page anchor links (e.g. <a href="#work">).
 * Ensures smooth, unified scrolling while preserving browser history and avoiding jarring jumps.
 */
export function initAnchorScrollListener() {
  if (typeof window === 'undefined') return () => {};

  const handleClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;

    const targetId = href.slice(1);
    const targetElement = document.getElementById(targetId);
    if (!targetElement && targetId !== 'top') return;

    e.preventDefault();
    smoothScrollTo(targetId, {
      onComplete: () => {
        if (targetId === 'top') {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', href);
          }
        }
      }
    });
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}
