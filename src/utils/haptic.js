/**
 * Haptic Feedback Utility (Chánh Đại - chanhdai.com/components/haptic)
 * 
 * Triggers smooth, tactile haptic feedback on mobile devices.
 * - Uses the W3C Vibration API on Android and modern browsers.
 * - Uses the native iOS WebKit switch haptic tick trick on iOS Safari.
 * 
 * @see https://chanhdai.com/components/haptic
 * @see https://developer.mozilla.org/docs/Web/API/Vibration_API
 */

export const isTouchDevice =
  typeof window !== 'undefined'
    ? window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
    : false;

/**
 * Trigger haptic feedback on mobile devices.
 * Uses Vibration API on Android/modern browsers, and iOS checkbox switch trick on iOS.
 *
 * @param {number | number[]} [pattern=50] - Vibration duration (ms) or pattern.
 * Custom patterns work on Android devices. iOS uses native system haptic feedback.
 *
 * @example
 * import { haptic } from '../utils/haptic';
 * haptic(); // standard 50ms tactile tick
 * haptic([40, 30, 40]); // double pulse
 */
export function haptic(pattern = 50) {
  try {
    // If running on a touch-capable device or mobile
    if (isTouchDevice) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
        return;
      }

      // iOS haptic trick via checkbox switch element (iOS 17.4+ WebKit)
      if (typeof document !== 'undefined') {
        const label = document.createElement('label');
        label.ariaHidden = 'true';
        label.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.setAttribute('switch', '');
        label.appendChild(input);

        try {
          document.head.appendChild(label);
          label.click();
        } finally {
          document.head.removeChild(label);
        }
        return;
      }
    }

    // Fallback: If navigator.vibrate is available even on non-coarse devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Graceful fallback if vibration permission is denied or unsupported
  }
}

export default haptic;
