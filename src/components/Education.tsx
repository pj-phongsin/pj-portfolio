import { education } from '../data/profile';
import { LogoMark } from './LogoMark';
import { MaskedText } from './MaskedText';
import { Reveal } from './Reveal';
import styles from './Education.module.css';

export function Education() {
  return (
    <section id="education" className={`container section ${styles.education}`}>
      <MaskedText as="h2" text="Education" className={styles.heading} />
      <ul className={styles.list}>
        {education.map((entry, index) => (
          <li key={entry.institution + entry.degree} className={styles.item}>
            <Reveal delay={index * 0.06}>
              <div className={styles.itemHeader}>
                <h3 className={styles.itemTitle}>{entry.degree}</h3>
                <p className={styles.itemInstitution}>
                  {entry.institution} · {entry.location}
                </p>
                <span className={styles.itemMeta}>{entry.period}</span>
              </div>
              {entry.specialisation && (
                <p className={styles.itemDetail}>
                  <span className={styles.label}>Specialisation:</span> {entry.specialisation}
                </p>
              )}
              <p className={styles.itemDetail}>
                <span className={styles.label}>Core competencies:</span> {entry.competencies}
              </p>
              {entry.note && (
                <p className={styles.itemDetail}>
                  <span className={styles.label}>Note:</span> {entry.note}
                </p>
              )}
            </Reveal>
            <LogoMark
              src={entry.logo}
              alt={`${entry.institution} logo`}
              invertOnDark={entry.invertOnDark}
              delay={index * 0.06}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
