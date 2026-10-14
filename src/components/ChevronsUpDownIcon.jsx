import React, { useEffect, useImperativeHandle } from 'react';
import { motion, useAnimation } from 'motion/react';

/**
 * Chevrons Up Down Icon (Chánh Đại - chanhdai.com/components/chevrons-up-down-icon)
 * 
 * Animated chevrons icon that morphs between outward pointing (expandable)
 * and inward pointing (collapsible) directions.
 * 
 * Supports both imperative control via ref (startAnimation / stopAnimation)
 * and declarative control via the `open` boolean prop.
 * 
 * @see https://chanhdai.com/components/chevrons-up-down-icon
 */
export function ChevronsUpDownIcon({
  ref,
  open,
  duration = 0.25,
  size = 20,
  className = '',
  style = {},
  ...props
}) {
  const controls = useAnimation();

  useImperativeHandle(ref, () => ({
    startAnimation: () => controls.start('animate'),
    stopAnimation: () => controls.start('normal'),
  }));

  useEffect(() => {
    if (open !== undefined) {
      if (open) {
        controls.start('animate');
      } else {
        controls.start('normal');
      }
    }
  }, [open, controls]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <motion.path
        d="M7 15L12 20L17 15"
        variants={{
          normal: {
            d: 'M7 15L12 20L17 15',
          },
          animate: {
            d: 'M7 20L12 15L17 20',
          },
        }}
        initial={open ? 'animate' : 'normal'}
        animate={controls}
        transition={{
          duration,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      <motion.path
        d="M7 9L12 4L17 9"
        variants={{
          normal: {
            d: 'M7 9L12 4L17 9',
          },
          animate: {
            d: 'M7 4L12 9L17 4',
          },
        }}
        initial={open ? 'animate' : 'normal'}
        animate={controls}
        transition={{
          duration,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </svg>
  );
}

export default ChevronsUpDownIcon;
