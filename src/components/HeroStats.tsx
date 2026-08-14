import { projects } from '../data/projects';
import { CountUp } from './CountUp';
import styles from './HeroStats.module.css';

/**
 * Both figures are derived from the project data rather than typed in, so they
 * can't drift out of sync with the Projects section below.
 */
const STATS = [
  { value: projects.length, label: 'Projects' },
  { value: projects.filter((project) => project.publication).length, label: 'Published papers' },
];

/**
 * Small stat pair in the hero's lower right — a secondary detail, deliberately
 * offset from the headline rather than balanced against it.
 */
export function HeroStats() {
  return (
    <ul className={styles.stats}>
      {STATS.map((stat, index) => (
        // The count-up rewrites the number every frame, so the readable value
        // lives on the item and its animating parts are hidden from AT.
        <li key={stat.label} className={styles.stat} aria-label={`${stat.value} ${stat.label}`}>
          <span className={styles.value} aria-hidden="true">
            <CountUp value={stat.value} trigger="mount" delay={0.9 + index * 0.12} />
          </span>
          <span className={styles.label} aria-hidden="true">
            {stat.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
