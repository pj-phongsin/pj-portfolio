import { createElement, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** 'mount' animates immediately on render (hero, page entrances); 'scroll' waits for the viewport. */
  trigger?: 'mount' | 'scroll';
  /** Element to render. Use 'li' inside lists so a bullet ::before animates with the content. */
  as?: 'div' | 'li';
  /** ScrollTrigger start. Defaults to the value used across the home page. */
  start?: string;
  /**
   * Element whose position drives the trigger, instead of this one. Lets a
   * section's body fire off the section itself, so it stays in step with the
   * heading rather than each bullet triggering on its own position.
   */
  triggerRef?: RefObject<HTMLElement | null>;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  trigger = 'scroll',
  as = 'div',
  start = 'top 85%',
  triggerRef,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        ...(trigger === 'scroll'
          ? {
              scrollTrigger: {
                trigger: triggerRef?.current ?? el,
                start,
                toggleActions: 'play none none reverse',
              },
            }
          : {}),
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, trigger, start, triggerRef]);

  return createElement(as, { ref, className }, children);
}
