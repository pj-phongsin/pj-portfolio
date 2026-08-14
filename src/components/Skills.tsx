import { skills } from '../data/profile';
import { MaskedText } from './MaskedText';
import { NetworkGraphic } from './NetworkGraphic';
import { Reveal } from './Reveal';
import styles from './Skills.module.css';

export function Skills() {
  return (
    <section id="skills" className={`container section ${styles.skills}`}>
      <NetworkGraphic />
      <MaskedText as="h2" text="Technical Skills" className={styles.heading} />
      <div className={styles.groups}>
        {skills.map((group, index) => (
          <Reveal key={group.category} delay={index * 0.05}>
            <div className={styles.group}>
              <h3 className={styles.category}>{group.category}</h3>
              <ul className={styles.tags}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
