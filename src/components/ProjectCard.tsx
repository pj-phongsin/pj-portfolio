import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import styles from './ProjectCard.module.css';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.id}`} className={styles.card}>
      <p className={styles.kind}>{project.kind}</p>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.tagline}>{project.tagline}</p>
      {project.publication && <p className={styles.publication}>{project.publication}</p>}
      <ul className={styles.tech}>
        {project.tech.slice(0, 5).map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <span className={styles.cta}>View project →</span>
    </Link>
  );
}
