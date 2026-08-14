import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';
import { prefersReducedMotion } from './prefersReducedMotion';

interface SlideInOptions {
  /** Horizontal offset to travel from, in px. Positive comes from the right. */
  x?: number;
  delay?: number;
  /** Play once and stay put, rather than reversing when scrolled back past. */
  once?: boolean;
  /**
   * ScrollTrigger start. Deliberately later than the `top 85%` used by the
   * small fades elsewhere: at 85% this fires while the carousel is only ~28%
   * on screen, so the whole 220px glide plays out below the fold and only the
   * last ~10% is ever seen. Measured at 1440x900 — see PORTFOLIO_PLAN.md.
   *
   * `clamp()` is load-bearing, not decoration. A later start means an element
   * near the END of a page may never reach it — the document runs out of
   * scroll first. PhishGuard's Highlights is the last section, and its
   * description stalled at 616px against a 495px trigger, so it never
   * animated at all. clamp() keeps the trigger inside the scrollable range.
   */
  start?: string;
  /**
   * Element whose position drives the trigger. Defaults to the animated element
   * itself. Pass a shared ancestor when several elements must move as one unit:
   * in the centred carousel layout the description sits BELOW the screenshot,
   * so triggering each on its own position makes them arrive separately no
   * matter how the delays are set.
   */
  triggerRef?: RefObject<HTMLElement | null>;
}

/**
 * Slide-and-fade an existing element into place on scroll.
 *
 * A hook rather than a wrapper component because the elements this animates are
 * CSS Grid children — wrapping them in a `<Reveal>` div would make the wrapper
 * the grid item and collapse the layout, the same way it broke the project
 * cards when they were wrapped for their fade-up.
 */
export function useSlideIn(
  ref: RefObject<HTMLElement | null>,
  { x = 220, delay = 0, once = false, start = 'clamp(top 55%)', triggerRef }: SlideInOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, x },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: triggerRef?.current ?? el,
          start,
          // Glides back out on scroll-up and in again on the way down, so the
          // motion is visible on every pass rather than only on first load.
          once,
          ...(once ? {} : { toggleActions: 'play none none reverse' }),
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, x, delay, once, start, triggerRef]);
}
