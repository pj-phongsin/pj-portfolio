import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Unmasks content with a left-to-right wipe instead of a fade. */
export function ClipReveal({ children, className, delay = 0 }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
        delay,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        // Once the wipe finishes it already shows the full box, so dropping the
        // clip entirely is seamless — and it stops the rectangular clip from
        // squaring off the card's rounded corners or clipping its hover lift.
        onComplete: () => gsap.set(el, { clipPath: 'none' }),
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
