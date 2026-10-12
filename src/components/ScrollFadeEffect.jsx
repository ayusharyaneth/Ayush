import React from 'react';

/**
 * ScrollFadeEffect
 * Fade content edges as you scroll, for both vertical and horizontal layouts.
 * Adapted from Chanh Dai (https://chanhdai.com/components/scroll-fade-effect)
 */
export function ScrollFadeEffect({
  className = '',
  orientation = 'vertical',
  children,
  style,
  ...props
}) {
  return (
    <div
      data-orientation={orientation}
      className={`scroll-fade-effect-${orientation === 'horizontal' ? 'x' : 'y'} ${className}`}
      style={{
        position: 'relative',
        ...(orientation === 'horizontal' ? { overflowX: 'auto' } : { overflowY: 'auto' }),
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default ScrollFadeEffect;
