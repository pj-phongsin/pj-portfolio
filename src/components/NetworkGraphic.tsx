import styles from './NetworkGraphic.module.css';

/** Abstract node-graph illustration for the Skills section. Purely decorative. */
export function NetworkGraphic() {
  return (
    <svg
      className={styles.graphic}
      viewBox="0 0 360 360"
      fill="none"
      aria-hidden="true"
    >
      <g className={styles.edges}>
        <line x1="60" y1="80" x2="180" y2="40" />
        <line x1="180" y1="40" x2="300" y2="100" />
        <line x1="60" y1="80" x2="140" y2="190" />
        <line x1="300" y1="100" x2="140" y2="190" />
        <line x1="140" y1="190" x2="80" y2="300" />
        <line x1="140" y1="190" x2="250" y2="260" />
        <line x1="300" y1="100" x2="250" y2="260" />
        <line x1="250" y1="260" x2="80" y2="300" />
        <line x1="180" y1="40" x2="140" y2="190" />
      </g>
      <g className={styles.nodes}>
        <circle cx="60" cy="80" r="6" />
        <circle cx="180" cy="40" r="8" />
        <circle cx="300" cy="100" r="6" />
        <circle cx="140" cy="190" r="10" />
        <circle cx="80" cy="300" r="6" />
        <circle cx="250" cy="260" r="8" />
      </g>
    </svg>
  );
}
