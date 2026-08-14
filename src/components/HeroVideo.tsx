import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';
import styles from './HeroVideo.module.css';

interface HeroVideoProps {
  /** Path under /public to the looping footage. */
  src: string;
  /**
   * Heavier scrim, for the home hero. That hero carries small dim text (the
   * eyebrow, the role line, the stat labels) which the default scrim cannot
   * hold at AA — the project-detail heroes only sit under large white titles,
   * so they keep the lighter grade and stay untouched.
   */
  dim?: boolean;
}

/**
 * Decorative full-bleed looping video for a page hero. Renders behind its
 * container's content with a dark scrim, and fades into the page background at
 * its base so there's no seam at the section boundary.
 */
export function HeroVideo({ src, dim = false }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Set the property, not just the JSX attribute — autoplay policies read the
    // live muted state, and an unmuted video is refused outright.
    video.muted = true;

    // Reduced motion: hold a single frame instead of looping. Nudging past 0
    // forces a decoded frame to paint; a video that never played can otherwise
    // sit blank, leaving an empty dark band.
    if (prefersReducedMotion()) {
      const showFirstFrame = () => {
        video.currentTime = 0.1;
      };
      if (video.readyState >= 1) {
        showFirstFrame();
      } else {
        video.addEventListener('loadedmetadata', showFirstFrame, { once: true });
      }
      return () => video.removeEventListener('loadedmetadata', showFirstFrame);
    }

    // Only decode while the hero is on screen — a 720p loop running behind
    // three screens of body copy is wasted battery.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (iOS Low Power Mode, for one). The
          // paused first frame is a fine fallback, so swallow the rejection.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0 },
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={`${styles.layer}${dim ? ` ${styles.dim}` : ''}`} aria-hidden="true">
      <video
        ref={ref}
        className={styles.video}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
      />
    </div>
  );
}
