import { projects } from '../data/projects';
import { ClipReveal } from './ClipReveal';
import { MaskedText } from './MaskedText';
import { ProjectCard } from './ProjectCard';
import styles from './Projects.module.css';

export function Projects() {
  return (
    <section id="projects" className={`container section ${styles.projects}`}>
      <MaskedText as="h2" text="Projects" className={styles.heading} />
      <div className={styles.grid}>
        {projects.map((project, index) => (
          // Stagger by column position only — a per-index delay across 10 cards
          // would make below-the-fold rows wait over a second after scrolling in.
          <ClipReveal key={project.id} delay={(index % 2) * 0.15} className={styles.cardReveal}>
            <ProjectCard project={project} />
          </ClipReveal>
        ))}
      </div>
    </section>
  );
}
