import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';
import styles from './LogoMark.module.css';

/** Large organisation logo that fills the empty right side of an entry. Fades
    and rises in with the entry's copy — the same tween <Reveal> runs on the
    text, fired off the same trigger so the two move as one block. */
export function LogoMark({
  src,
  alt,
  invertOnDark = false,
  delay = 0,
}: {
  src: string;
  alt: string;
  invertOnDark?: boolean;
  /** Match the sibling <Reveal>'s delay so the logo and copy rise together. */
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          // The entry, not the logo: .wrap is absolutely positioned at the
          // item's vertical centre, so triggering off itself would fire about
          // half an entry later than the copy it's meant to move with.
          trigger: el.closest('li') ?? el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <span ref={ref} className={styles.wrap} aria-hidden="true">
      <img
        src={`${src}?v=2`}
        alt={alt}
        className={`${styles.logo}${invertOnDark ? ` ${styles.invertOnDark}` : ''}`}
        loading="lazy"
      />
    </span>
  );
}
