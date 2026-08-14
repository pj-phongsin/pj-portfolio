import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';
import { prefersReducedMotion } from './prefersReducedMotion';

interface ScrollScaleOptions {
  /** Scale at the start of the range; 1 is full size. */
  from?: number;
  /** Opacity at the start of the range. */
  fromOpacity?: number;
}

/**
 * Grow an element to full size as it scrolls into view, tied to scroll position
 * rather than played once — scrubbing back up shrinks it again, which is what
 * makes the effect feel physical instead of like an animation that fired.
 *
 * Pair with `transform-origin: center bottom` so it expands upward from its
 * base rather than outward from its middle.
 */
export function useScrollScale(
  ref: RefObject<HTMLElement | null>,
  { from = 0.7, fromOpacity = 0.55 }: ScrollScaleOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { scale: from, opacity: fromOpacity },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          // Small as its top enters from below, full size well before centre.
          start: 'top 95%',
          end: 'top 45%',
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, from, fromOpacity]);
}
