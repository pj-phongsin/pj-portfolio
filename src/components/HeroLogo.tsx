import type { CSSProperties } from 'react';
import styles from './HeroLogo.module.css';

interface HeroLogoProps {
  /** Path under /public to the brand mark (transparent PNG). */
  src: string;
  /** Brand colour for the glow behind the mark; defaults to the site accent. */
  glow?: string;
}

/**
 * Oversized brand mark used as a page-hero backdrop — anchored right and
 * cropped by the viewport edge, sitting behind the hero text. Keeps the
 * artwork's real colours; a soft glow behind it carries the darker parts of a
 * logo that would otherwise sink into the dark theme's background.
 */
export function HeroLogo({ src, glow }: HeroLogoProps) {
  return (
    <div
      className={styles.layer}
      aria-hidden="true"
      style={glow ? ({ '--hero-logo-glow': glow } as CSSProperties) : undefined}
    >
      <img className={styles.mark} src={src} alt="" />
    </div>
  );
}
