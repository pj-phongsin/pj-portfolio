import { useEffect, useRef, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';
import styles from './TextReveal.module.css';

interface TextRevealProps {
  text: string;
  className?: string;
  /** Lock content in place while the scrub plays, then release (Apple-style). */
  pin?: boolean;
  /** Element to pin instead of the paragraph itself — lets a whole block
      (heading + paragraph + trailing lines) hold together during the scrub. */
  pinTarget?: RefObject<HTMLElement | null>;
}

export function TextReveal({ text, className, pin = false, pinTarget }: TextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll(`.${styles.word}`);

    // The stylesheet dims words by default; without the tween they'd stay
    // dim forever, so restore full opacity and skip the effect entirely.
    if (prefersReducedMotion()) {
      gsap.set(words, { opacity: 1 });
      return;
    }

    const pinEl = pinTarget?.current ?? el;

    // Pin and scrub are separate triggers: the scrub starts the moment the
    // block enters the viewport (so scrolling in from the section above shows
    // motion immediately), while the pin only engages once the block reaches
    // 25% from the top and holds until the scrub's end. The scrub span
    // (80% → 25% approach = 55%, plus the 60% pinned stretch) is sized so the
    // last words brighten exactly at pin release.
    const pinTrigger = pin
      ? ScrollTrigger.create({
          trigger: pinEl,
          start: 'top 25%',
          end: '+=60%',
          pin: pinEl,
        })
      : undefined;

    const tween = gsap.fromTo(
      words,
      { opacity: 0.35 },
      {
        opacity: 1,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: pin
          ? {
              trigger: pinEl,
              start: 'top 80%',
              end: '+=115%',
              scrub: true,
            }
          : {
              trigger: el,
              start: 'top 80%',
              end: 'bottom 55%',
              scrub: true,
            },
      },
    );

    return () => {
      pinTrigger?.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text, pin, pinTarget]);

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((word, index) => (
        <span key={`${word}-${index}`} className={styles.word}>
          {word}{' '}
        </span>
      ))}
    </p>
  );
}
