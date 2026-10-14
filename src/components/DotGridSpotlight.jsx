import React, { useEffect, useRef } from 'react';

/**
 * DotGridSpotlight
 * Ultra-performant interactive dot grid with a cursor-tracking spotlight effect.
 * Adapted from Chanh Dai (https://chanhdai.com/components/dot-grid-spotlight)
 * Fully compatible with both Dark and Light themes.
 *
 * Performance features:
 * 1. Fixed viewport canvas (100vw x 100vh) rather than multi-thousand pixel document heights.
 * 2. Batched base dots: all thousands of static dots are rendered in 1 single path and 1 GPU fill call.
 * 3. Spotlight dots: only the handful of dots (~15) within the cursor spotlight radius are individually calculated.
 * 4. Zero idle CPU: render loop sleeps when pointer is stationary or out of window.
 * 5. Passive window resize listener without ResizeObserver loop errors.
 */
export default function DotGridSpotlight({
  theme = 'dark',
  dotColor,
  activeDotColor,
  spacing = 24,
  baseRadius = 1,
  activeRadius = 2.4,
  interactionRadius = 130,
  activeMaxAlpha = 0.9,
  activeMinAlpha = 0.25,
  className = ''
}) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -2000, y: -2000, isActive: false });

  // Resolve theme-specific dot colors if not explicitly provided
  const resolvedDotColor =
    dotColor ||
    (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)');

  const resolvedActiveDotColor =
    activeDotColor ||
    (theme === 'dark' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let renderFrameId = null;
    let offscreenCanvas = null;

    const draw = () => {
      renderFrameId = null;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      // Blit pre-rendered static base dots in a single instant GPU pass
      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0, width, height);
      }

      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;
      const isMouseActive = mouse.current.isActive;

      // Localized spotlight dots: only calculate for the ~12 dots near the cursor
      if (isMouseActive) {
        const offsetX = (width % spacing) / 2;
        const offsetY = (height % spacing) / 2;
        const radiusSq = interactionRadius * interactionRadius;

        const startX = Math.max(offsetX, Math.floor((mouseX - interactionRadius - offsetX) / spacing) * spacing + offsetX);
        const endX = Math.min(width, Math.ceil((mouseX + interactionRadius - offsetX) / spacing) * spacing + offsetX);
        const startY = Math.max(offsetY, Math.floor((mouseY - interactionRadius - offsetY) / spacing) * spacing + offsetY);
        const endY = Math.min(height, Math.ceil((mouseY + interactionRadius - offsetY) / spacing) * spacing + offsetY);

        for (let x = startX; x <= endX; x += spacing) {
          for (let y = startY; y <= endY; y += spacing) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;
            if (distSq < radiusSq) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / interactionRadius;
              const currentRadius = baseRadius + (activeRadius - baseRadius) * factor;
              const currentAlpha = activeMinAlpha + (activeMaxAlpha - activeMinAlpha) * factor;

              ctx.save();
              ctx.globalAlpha = currentAlpha;
              ctx.beginPath();
              ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
              ctx.fillStyle = resolvedActiveDotColor;
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }
    };

    const requestDraw = () => {
      if (renderFrameId === null) {
        renderFrameId = requestAnimationFrame(draw);
      }
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Pre-render static dot grid once on resize onto an offscreen canvas
      offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      const offCtx = offscreenCanvas.getContext('2d');
      if (offCtx) {
        offCtx.setTransform(1, 0, 0, 1, 0, 0);
        offCtx.scale(dpr, dpr);

        const offsetX = (width % spacing) / 2;
        const offsetY = (height % spacing) / 2;

        offCtx.beginPath();
        for (let x = offsetX; x <= width; x += spacing) {
          for (let y = offsetY; y <= height; y += spacing) {
            offCtx.moveTo(x + baseRadius, y);
            offCtx.arc(x, y, baseRadius, 0, Math.PI * 2);
          }
        }
        offCtx.fillStyle = resolvedDotColor;
        offCtx.fill();
      }

      draw();
      canvas.dataset.ready = 'true';
    };

    const hasHover = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches;

    const handlePointerMove = (e) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY,
        isActive: true
      };
      requestDraw();
    };

    const handlePointerLeave = () => {
      mouse.current.isActive = false;
      requestDraw();
    };

    if (hasHover) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });

    resizeCanvas();

    return () => {
      if (hasHover) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
      }
      window.removeEventListener('resize', resizeCanvas);
      if (renderFrameId !== null) cancelAnimationFrame(renderFrameId);
    };
  }, [
    spacing,
    baseRadius,
    activeRadius,
    interactionRadius,
    resolvedDotColor,
    resolvedActiveDotColor,
    activeMaxAlpha,
    activeMinAlpha
  ]);

  return (
    <canvas
      ref={canvasRef}
      data-ready="false"
      className={`dot-grid-spotlight-canvas ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 1,
        transition: 'opacity 0.3s ease'
      }}
      aria-hidden="true"
    />
  );
}
