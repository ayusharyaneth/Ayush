/**
 * Smooth Scrolling Controller for Antigravity Portfolio
 * 
 * Implements fluid, natural easing with controlled acceleration and deceleration.
 * Automatically adapts to desktop sticky navbar and mobile bottom navigation dock.
 * Respects prefers-reduced-motion and supports instant cancellation on manual scroll.
 */

let activeAnimationId = null;
let activeInterruptHandler = null;

/**
 * Natural cubic-bezier easing curve (easeInOutCubic)
 * Offers gentle acceleration, fluid velocity through mid-scroll, and soft landing.
 */
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
 * Cancels any in-progress smooth scroll immediately.
 */
export function cancelSmoothScroll() {
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
 * 
 * @param {string|number|HTMLElement} target - Section ID ('top', 'work', etc.), pixel coordinate, or element
 * @param {Object} [options]
 * @param {number} [options.offset] - Custom top offset in pixels
 * @param {number} [options.duration] - Optional custom animation duration in ms
 * @param {Function} [options.onComplete] - Callback executed upon reaching destination
 * @param {Function} [options.onInterrupt] - Callback executed if user cancels via touch/wheel
 * @returns {Promise<void>}
 */
export function smoothScrollTo(target, options = {}) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Resolve target Y position
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
        const headerOffset = options.offset !== undefined ? options.offset : getHeaderOffset();
        targetY = rect.top + window.scrollY - headerOffset;
      } else {
        targetY = 0;
      }
    }

    // Clamp target within document bounds
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    targetY = Math.max(0, Math.min(targetY, maxScroll));

    const startY = window.scrollY;
    const distance = targetY - startY;

    // If already at destination
    if (Math.abs(distance) < 2) {
      options.onComplete?.();
      resolve();
      return;
    }

    // If user prefers reduced motion, scroll immediately without animation
    if (prefersReducedMotion) {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      options.onComplete?.();
      resolve();
      return;
    }

    // Cancel any active animation
    cancelSmoothScroll();

    // Natural physics-based duration:
    // Scale duration with sqrt(distance) so short jumps are snappy (~450ms)
    // and long traverses remain graceful and controlled (~800ms)
    const duration = options.duration || Math.min(
      850,
      Math.max(450, Math.round(Math.sqrt(Math.abs(distance)) * 22))
    );

    let startTime = null;

    // Temporarily disable CSS scroll-behavior: smooth on html to avoid interpolation conflicts
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
        // Animation completed successfully
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
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', href);
        }
      }
    });
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}
