import { useRef } from 'react';
import { profile } from '../data/profile';
import { MaskedText } from './MaskedText';
import { Reveal } from './Reveal';
import { TextReveal } from './TextReveal';
import styles from './About.module.css';

export function About() {
  // The whole block (heading + bio + "looking for") pins together while the
  // bio's word-scrub plays, so the heading doesn't scroll away mid-animation.
  const pinRef = useRef<HTMLDivElement>(null);

  return (
    <section id="about" className={`container section ${styles.about}`}>
      <div ref={pinRef}>
        <MaskedText as="h2" text="About" className={styles.heading} />
        <TextReveal text={profile.summary} className={styles.summary} pin pinTarget={pinRef} />
        <Reveal>
          <p className={styles.lookingFor}>{profile.lookingFor}</p>
        </Reveal>
      </div>
    </section>
  );
}
