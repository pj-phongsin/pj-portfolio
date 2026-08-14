import { experience } from '../data/profile';
import { LogoMark } from './LogoMark';
import { MaskedText } from './MaskedText';
import { Reveal } from './Reveal';
import styles from './Experience.module.css';

export function Experience() {
  return (
    <section id="experience" className={`container section ${styles.experience}`}>
      <MaskedText as="h2" text="Experience" className={styles.heading} />
      <ul className={styles.list}>
        {experience.map((entry, index) => (
          <li key={entry.company + entry.role} className={styles.item}>
            <Reveal delay={index * 0.06}>
              <div className={styles.itemHeader}>
                <h3 className={styles.itemTitle}>{entry.role}</h3>
                <p className={styles.itemCompany}>
                  {entry.company} · {entry.location}
                </p>
                <span className={styles.itemMeta}>
                  {entry.period}
                  {entry.current ? ' · Current' : ''}
                </span>
              </div>
              <ul className={styles.bullets}>
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              {entry.link && (
                <p className={styles.link}>
                  <a href={entry.link.url} target="_blank" rel="noreferrer">
                    {entry.link.label} →
                  </a>
                </p>
              )}
            </Reveal>
            <LogoMark
              src={entry.logo}
              alt={`${entry.company} logo`}
              invertOnDark={entry.invertOnDark}
              delay={index * 0.06}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
