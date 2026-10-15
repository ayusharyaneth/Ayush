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
    // - naiveDimensions: true (dynamically evaluates real-time document height without 250ms debounce)
    // - prevent: ignores wheel on modals, popovers, and inner scrollable regions
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
      naiveDimensions: true,
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
 * Forces smooth scroll engine to immediately recalculate document dimensions.
 * Crucial when route or view changes drastically alter document height (e.g. support -> home).
 */
export function resizeSmoothScroll() {
  if (lenisInstance) {
    try {
      lenisInstance.resize();
    } catch {
      // safe fallback
    }
  }
}

/**
 * Cancels any in-progress smooth scroll immediately.
 */
export function cancelSmoothScroll() {
  if (lenisInstance) {
    try {
      // Halts active programmatic scroll smoothly
      lenisInstance.stop();
      lenisInstance.start();
    } catch {
      // safe fallback
    }
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

    // Resolve target: handles strings ('#work' or 'work'), numbers, and DOM elements
    // If an element is not yet in the DOM (e.g. React view change), polls for it up to 1200ms
    const resolveTarget = () => {
      if (typeof target === 'number') {
        return Promise.resolve(target);
      }
      if (target === 'top' || target === '#top' || target === '#' || target === '' || !target) {
        return Promise.resolve(0);
      }
      if (target instanceof HTMLElement) {
        return Promise.resolve(target);
      }
      if (typeof target === 'string') {
        const elementId = target.replace(/^#/, '');
        if (elementId === 'top' || elementId === 'home' || elementId === '') {
          return Promise.resolve(0);
        }

        const immediate = document.getElementById(elementId);
        if (immediate) {
          return Promise.resolve(immediate);
        }

        return new Promise((res) => {
          const startTime = performance.now();
          const poll = () => {
            const el = document.getElementById(elementId);
            if (el) {
              res(el);
              return;
            }
            if (performance.now() - startTime >= 1200) {
              res(null);
              return;
            }
            requestAnimationFrame(poll);
          };
          requestAnimationFrame(poll);
        });
      }
      return Promise.resolve(null);
    };

    resolveTarget().then((resolved) => {
      // Refresh Lenis bounds & document dimensions before calculating target
      resizeSmoothScroll();

      // 1. Top / 0 scroll
      if (resolved === 0) {
        if (prefersReducedMotion || options.immediate) {
          window.scrollTo({ top: 0, behavior: 'auto' });
          if (lenisInstance) {
            try {
              lenisInstance.scrollTo(0, { immediate: true });
            } catch {
              // safe fallback
            }
          }
          options.onComplete?.();
          resolve();
          return;
        }

        if (lenisInstance) {
          lenisInstance.scrollTo(0, {
            offset: 0,
            duration: options.duration ? options.duration / 1000 : 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            immediate: false,
            force: true,
            onComplete: () => {
              options.onComplete?.();
              resolve();
            }
          });
          return;
        }

        runFallbackScroll(0, options, resolve);
        return;
      }

      // If target resolution completely failed, log and gracefully exit without jumping to 0
      if (resolved === null) {
        console.warn('[SmoothScroll] Target could not be found in DOM:', target);
        options.onComplete?.();
        resolve();
        return;
      }

      // 2. Reduced motion or immediate jump
      if (prefersReducedMotion || options.immediate) {
        let destY = 0;
        if (typeof resolved === 'number') {
          destY = resolved;
        } else if (resolved instanceof HTMLElement) {
          const rect = resolved.getBoundingClientRect();
          destY = rect.top + window.scrollY - headerOffset;
        }
        window.scrollTo({ top: Math.max(0, destY), behavior: 'auto' });
        if (lenisInstance) {
          try {
            lenisInstance.scrollTo(resolved, { immediate: true, offset: -headerOffset, force: true });
          } catch {
            // safe fallback
          }
        }
        options.onComplete?.();
        resolve();
        return;
      }

      // 3. PRIMARY PATH: Lenis Smooth Scroll Engine (ossium.in)
      if (lenisInstance) {
        lenisInstance.scrollTo(resolved, {
          offset: typeof resolved === 'number' ? 0 : -headerOffset,
          duration: options.duration ? options.duration / 1000 : 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          immediate: false,
          force: true,
          onComplete: () => {
            options.onComplete?.();
            resolve();
          }
        });
        return;
      }

      // 4. FALLBACK PATH: Physics-based Cubic Bezier Animation Loop
      let destY = 0;
      if (typeof resolved === 'number') {
        destY = resolved;
      } else if (resolved instanceof HTMLElement) {
        const rect = resolved.getBoundingClientRect();
        destY = rect.top + window.scrollY - headerOffset;
      }
      runFallbackScroll(destY, options, resolve);
    });
  });
}

function runFallbackScroll(targetY, options, resolve) {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clampedTargetY = Math.max(0, Math.min(targetY, maxScroll));
  const startY = window.scrollY;
  const distance = clampedTargetY - startY;

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
      window.scrollTo(0, clampedTargetY);
      cleanup();
      options.onComplete?.();
      resolve();
    }
  };

  activeAnimationId = requestAnimationFrame(step);
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
