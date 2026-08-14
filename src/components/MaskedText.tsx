import { createElement, useEffect, useRef, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';
import styles from './MaskedText.module.css';

interface MaskedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** 'mount' animates immediately (hero, page entrances); 'scroll' waits for the viewport. */
  trigger?: 'mount' | 'scroll';
  delay?: number;
  /** ScrollTrigger start. Defaults to the home page's existing value. */
  start?: string;
  /** Replay on every pass instead of firing once and staying put. */
  replay?: boolean;
  /**
   * Element whose position drives the trigger, instead of this one. Lets a
   * heading fire off its section so it stays in step with the section's body.
   */
  triggerRef?: RefObject<HTMLElement | null>;
}

export function MaskedText({
  text,
  as = 'span',
  className,
  trigger = 'scroll',
  delay = 0,
  start = 'top 88%',
  replay = false,
  triggerRef,
}: MaskedTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll(`.${styles.word}`);

    // Words start translated below their masks via the stylesheet; without the
    // tween they'd be invisible forever, so restore them and skip.
    if (prefersReducedMotion()) {
      gsap.set(words, { y: 0 });
      return;
    }

    const tween = gsap.to(words, {
      y: 0,
      duration: 0.9,
      delay,
      stagger: 0.06,
      ease: 'power4.out',
      ...(trigger === 'scroll'
        ? {
            scrollTrigger: {
              trigger: triggerRef?.current ?? el,
              start,
              ...(replay ? { toggleActions: 'play none none reverse' } : {}),
            },
          }
        : {}),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text, trigger, delay, start, replay, triggerRef]);

  return createElement(
    as,
    { ref, className },
    text.split(' ').map((word, index) => (
      <span key={`${word}-${index}`}>
        <span className={styles.mask}>
          <span className={styles.word}>{word}</span>
        </span>{' '}
      </span>
    )),
  );
}
