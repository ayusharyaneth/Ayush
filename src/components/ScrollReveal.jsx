import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Premium Apple / Linear / Chanh Dai spring curve
 * Gentle acceleration, fluid velocity through mid-motion, and soft landing.
 */
const EASE_SMOOTH = [0.16, 1, 0.3, 1];

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
};

/**
 * ScrollReveal: Progressively reveals content as it enters the viewport.
 * Combines subtle vertical translation, opacity fade, and a light blur-to-sharp focus transition on desktop.
 */
export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.65,
  distance = 20,
  blur = 4,
  className = '',
  style = {},
  as = 'div',
  once = true,
  amount = 0.15,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = isMobileDevice();
  const effectiveBlur = isMobile ? 0 : blur;

  // If user prefers reduced motion, render without movement or blur
  if (prefersReducedMotion) {
    const Component = as;
    return (
      <Component className={className} style={style} {...props}>
        {children}
      </Component>
    );
  }

  // Define initial and target states based on variant
  const getInitial = () => {
    const filter = effectiveBlur > 0 ? `blur(${effectiveBlur}px)` : undefined;
    switch (variant) {
      case 'fade':
        return { opacity: 0, filter };
      case 'fade-down':
        return { opacity: 0, y: -distance, filter };
      case 'scale':
        return { opacity: 0, scale: 0.96, filter };
      case 'fade-up':
      default:
        return { opacity: 0, y: distance, filter };
    }
  };

  const getTarget = () => {
    const filter = effectiveBlur > 0 ? 'blur(0px)' : undefined;
    switch (variant) {
      case 'scale':
        return { opacity: 1, scale: 1, filter };
      default:
        return { opacity: 1, y: 0, filter };
    }
  };

  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      initial={getInitial()}
      whileInView={getTarget()}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: EASE_SMOOTH
      }}
      className={className}
      style={{
        ...style,
        willChange: 'opacity, transform'
      }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * ScrollRevealGroup: Parent container coordinating staggered reveals across child elements
 */
export function ScrollRevealGroup({
  children,
  stagger = 0.08,
  delayChildren = 0.05,
  className = '',
  style = {},
  as = 'div',
  once = true,
  amount = 0.12,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const Component = as;
    return (
      <Component className={className} style={style} {...props}>
        {children}
      </Component>
    );
  }

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren
      }
    }
  };

  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * ScrollRevealItem: Child item within a ScrollRevealGroup
 */
export function ScrollRevealItem({
  children,
  distance = 18,
  blur = 4,
  duration = 0.6,
  className = '',
  style = {},
  as = 'div',
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = isMobileDevice();
  const effectiveBlur = isMobile ? 0 : blur;

  if (prefersReducedMotion) {
    const Component = as;
    return (
      <Component className={className} style={style} {...props}>
        {children}
      </Component>
    );
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: distance,
      ...(effectiveBlur > 0 ? { filter: `blur(${effectiveBlur}px)` } : {})
    },
    visible: {
      opacity: 1,
      y: 0,
      ...(effectiveBlur > 0 ? { filter: 'blur(0px)' } : {}),
      transition: {
        duration,
        ease: EASE_SMOOTH
      }
    }
  };

  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      variants={itemVariants}
      className={className}
      style={{
        ...style,
        willChange: 'opacity, transform'
      }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

export default ScrollReveal;
