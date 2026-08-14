import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';

interface CountUpProps {
  value: number;
  /** 'mount' animates on load (above-the-fold); 'scroll' waits for the viewport. */
  trigger?: 'mount' | 'scroll';
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Animates a number from 0 to its target — the count-up technique from the
 * animation plan. Renders the final value in markup so it's correct without
 * JavaScript, then counts from zero once mounted.
 */
export function CountUp({
  value,
  trigger = 'scroll',
  delay = 0,
  duration = 1.4,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // Layout effect, not effect: the element renders with its final value, so
  // resetting it to 0 after paint would flash the answer before counting to it.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = String(value);
      return;
    }

    const counter = { n: 0 };
    el.textContent = '0';

    const tween = gsap.to(counter, {
      n: value,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(counter.n));
      },
      ...(trigger === 'scroll'
        ? {
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
            },
          }
        : {}),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, trigger, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
