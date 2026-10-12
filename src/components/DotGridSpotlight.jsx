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

    const draw = () => {
      renderFrameId = null;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;

      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;
      const isMouseActive = mouse.current.isActive;
      const radiusSq = interactionRadius * interactionRadius;

      // 1. Single-pass batch for ALL inactive base dots (1 GPU draw call!)
      ctx.beginPath();
      const activeDots = [];

      for (let x = offsetX; x <= width; x += spacing) {
        for (let y = offsetY; y <= height; y += spacing) {
          if (isMouseActive) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;
            if (distSq < radiusSq) {
              activeDots.push({ x, y, dist: Math.sqrt(distSq) });
              continue;
            }
          }
          ctx.moveTo(x + baseRadius, y);
          ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
        }
      }

      ctx.fillStyle = resolvedDotColor;
      ctx.fill();

      // 2. Render only the small subset of active dots within the spotlight radius
      if (isMouseActive && activeDots.length > 0) {
        for (let i = 0; i < activeDots.length; i++) {
          const { x, y, dist } = activeDots[i];
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

      draw();
      canvas.dataset.ready = 'true';
    };

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

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });

    resizeCanvas();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
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
