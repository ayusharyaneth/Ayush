import React, { useRef, useEffect } from 'react';
import { sound } from '../utils/soundEffects';

export default function InteractiveCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = null;
    let width = 0;
    let height = 0;

    // 3D Polyhedron Nodes (Icosahedron / Diamond wireframe)
    const phi = (1 + Math.sqrt(5)) / 2;
    const baseVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return [x / len, y / len, z / len];
    });

    // Wireframe Edges
    const edges = [];
    for (let i = 0; i < baseVertices.length; i++) {
      for (let j = i + 1; j < baseVertices.length; j++) {
        const [x1, y1, z1] = baseVertices[i];
        const [x2, y2, z2] = baseVertices[j];
        const dist = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
        if (dist < 1.15) {
          edges.push([i, j]);
        }
      }
    }

    let targetRotX = 0.3;
    let targetRotY = 0.4;
    let curRotX = 0.3;
    let curRotY = 0.4;
    let time = 0;

    // Accent colors cached from CSS variables (never query getComputedStyle at 60fps)
    let accent = '#38BDF8';
    let borderLine = 'rgba(255,255,255,0.12)';

    const updateColors = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      accent = computedStyle.getPropertyValue('--accent').trim() || '#38BDF8';
      borderLine = computedStyle.getPropertyValue('--border-line').trim() || 'rgba(255,255,255,0.12)';
    };
    updateColors();

    const handleResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      updateColors();
    };

    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;
      targetRotY = mouseX * 2.5;
      targetRotX = -mouseY * 2.5;
    };

    const handleMouseLeave = () => {
      targetRotX = 0.3;
      targetRotY = 0.4;
    };

    let isVisible = true;

    const render = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      time += 0.015;
      curRotX += (targetRotX + Math.sin(time * 0.7) * 0.15 - curRotX) * 0.06;
      curRotY += (targetRotY + Math.cos(time * 0.5) * 0.2 - curRotY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width, height) * 0.32;
      const centerX = width / 2;
      const centerY = height / 2;

      // Rotate around Y and X
      const cosX = Math.cos(curRotX);
      const sinX = Math.sin(curRotX);
      const cosY = Math.cos(curRotY);
      const sinY = Math.sin(curRotY);

      const projected = baseVertices.map(([x, y, z]) => {
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const distance = 2.4;
        const pz = distance + z2;
        const px = centerX + (x2 / pz) * scale * 2.2;
        const py = centerY + (y2 / pz) * scale * 2.2;

        return { px, py, z2 };
      });

      // Draw background schematic target lines
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = borderLine;
      ctx.lineWidth = 1;
      ctx.moveTo(centerX - 90, centerY);
      ctx.lineTo(centerX + 90, centerY);
      ctx.moveTo(centerX, centerY - 90);
      ctx.lineTo(centerX, centerY + 90);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Edges with depth-based opacity
      edges.forEach(([i, j]) => {
        const v1 = projected[i];
        const v2 = projected[j];
        const avgZ = (v1.z2 + v2.z2) / 2;
        const alpha = Math.max(0.12, Math.min(0.85, (avgZ + 1) / 2));

        ctx.beginPath();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = alpha > 0.45 ? 1.5 : 1;
        ctx.moveTo(v1.px, v1.py);
        ctx.lineTo(v2.px, v2.py);
        ctx.stroke();
      });

      // Draw Vertex nodes
      projected.forEach((v) => {
        const alpha = Math.max(0.2, (v.z2 + 1) / 2);
        ctx.beginPath();
        ctx.fillStyle = accent;
        ctx.globalAlpha = alpha;
        ctx.arc(v.px, v.py, alpha > 0.5 ? 2.5 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // IntersectionObserver to pause rendering when scrolled out of view
    let observer;
    if (container && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (!wasVisible && isVisible) {
          updateColors();
          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        }
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const handleClick = () => {
    sound.playClick();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        cursor: 'crosshair',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
      title="Click for tactile audio"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '12px',
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          pointerEvents: 'none'
        }}
      >
        <span>COORD [θ: ±2.5 rad] · PERSPECTIVE MESH</span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-dim)',
          pointerEvents: 'none'
        }}
      >
        <span>Fig. 1.0</span>
      </div>

      <div
        className="handwritten-annotation"
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 14C8 14 14 11 19 4M19 4L14 3M19 4L21 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>follows your cursor • click for audio</span>
      </div>
    </div>
  );
}
