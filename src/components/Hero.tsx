import { profile } from '../data/profile';
import { HeroStats } from './HeroStats';
import { HeroVideo } from './HeroVideo';
import { Magnetic } from './Magnetic';
import { MaskedText } from './MaskedText';
import { PointerGlow } from './PointerGlow';
import { Reveal } from './Reveal';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={`container ${styles.hero}`}>
      {/* Order is the stack, back to front: footage + its scrim, then the
          pointer glow painted over it, then the copy. The glow stays the thing
          that reacts to the cursor; the video is texture behind it. */}
      <HeroVideo src="/homepage_hero_loop.mp4" dim />
      <PointerGlow onDark />
      <div className={styles.content}>
        <Reveal trigger="mount" delay={0.1} y={16}>
          <p className={styles.eyebrow}>{profile.location}</p>
        </Reveal>
        <MaskedText as="h1" text={profile.shortName} className={styles.name} trigger="mount" delay={0.2} />
        <MaskedText as="h2" text={profile.role} className={styles.role} trigger="mount" delay={0.4} />
        <Reveal trigger="mount" delay={0.6}>
          <p className={styles.pitch}>{profile.pitch}</p>
        </Reveal>
        <Reveal trigger="mount" delay={0.75}>
          <div className={styles.actions}>
            <Magnetic>
              <a href="/#projects" className={styles.primary}>
                View work
              </a>
            </Magnetic>
            <Magnetic>
              <a href="/#contact" className={styles.secondary}>
                Get in touch
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
      <HeroStats />
    </section>
  );
}
