import React, { useEffect, useRef } from 'react';

/**
 * DotGridSpotlight
 * Interactive dot grid with a cursor-tracking spotlight effect.
 * Adapted from Chanh Dai (https://chanhdai.com/components/dot-grid-spotlight)
 * Fully compatible with both Dark and Light themes.
 */
export default function DotGridSpotlight({
  theme = 'dark',
  dotColor,
  activeDotColor,
  spacing = 16,
  baseRadius = 1,
  activeRadius = 2.4,
  interactionRadius = 140,
  activeMaxAlpha = 1.0,
  activeMinAlpha = 0.35,
  className = ''
}) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -2000, y: -2000, isActive: false });

  // Resolve theme-specific dot colors if not explicitly provided
  const resolvedDotColor =
    dotColor ||
    (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.055)');

  const resolvedActiveDotColor =
    activeDotColor ||
    (theme === 'dark' ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.28)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let renderFrameId = null;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;

      for (let x = offsetX; x <= width; x += spacing) {
        for (let y = offsetY; y <= height; y += spacing) {
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let currentRadius = baseRadius;
          let currentColor = resolvedDotColor;
          let currentAlpha = 1.0;

          if (mouse.current.isActive && distance < interactionRadius) {
            const factor = 1 - distance / interactionRadius;
            currentRadius = baseRadius + (activeRadius - baseRadius) * factor;
            currentColor = resolvedActiveDotColor;
            currentAlpha = activeMinAlpha + (activeMaxAlpha - activeMinAlpha) * factor;
          }

          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = currentColor;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement || document.body;
      const dpr = window.devicePixelRatio || 1;
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || window.innerHeight;

      if (width === 0 || height === 0) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      draw();

      requestAnimationFrame(() => {
        if (canvas) canvas.dataset.ready = 'true';
      });
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true
      };

      if (renderFrameId === null) {
        renderFrameId = requestAnimationFrame(() => {
          draw();
          renderFrameId = null;
        });
      }
    };

    const handlePointerLeave = () => {
      mouse.current.isActive = false;
      if (renderFrameId === null) {
        renderFrameId = requestAnimationFrame(() => {
          draw();
          renderFrameId = null;
        });
      }
    };

    // Listen on window so cursor tracking works seamlessly even over cards, buttons & text
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => resizeCanvas());
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });

    resizeCanvas();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
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
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 1,
        transition: 'opacity 0.4s ease'
      }}
      aria-hidden="true"
    />
  );
}
