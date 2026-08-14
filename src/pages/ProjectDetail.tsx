import { useRef, type ReactNode, type RefObject } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject } from '../data/projects';
import { DemoVideo } from '../components/DemoVideo';
import { HeroLogo } from '../components/HeroLogo';
import { HeroVideo } from '../components/HeroVideo';
import { ScreenCarousel } from '../components/ScreenCarousel';
import { Magnetic } from '../components/Magnetic';
import { MaskedText } from '../components/MaskedText';
import { Reveal } from '../components/Reveal';
import styles from './ProjectDetail.module.css';

/**
 * Where a body section begins animating. Later than the home page's `top 88%`,
 * which fired while a section was barely into view and let two sections animate
 * at once. `clamp()` keeps it reachable for the last section on the page, whose
 * trigger point the document would otherwise run out of scroll before hitting.
 */
const SECTION_START = 'clamp(top 65%)';

/** Beat between a section's heading landing and its body following. */
const BODY_DELAY = 0.2;

/**
 * One body section: heading rises, then its content follows a beat later.
 *
 * Both animate off the SECTION's position, not their own boxes — that's what
 * keeps them a single unit. Triggering each element individually makes a long
 * section's lower content fire much later than its heading, which is what made
 * consecutive sections overlap.
 */
function Block({
  heading,
  wide = false,
  children,
}: {
  heading: string;
  wide?: boolean;
  children: (sectionRef: RefObject<HTMLElement | null>) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  return (
    <section ref={ref} className={`${styles.block}${wide ? ` ${styles.wideBlock}` : ''}`}>
      <MaskedText
        as="h2"
        text={heading}
        className={styles.heading}
        triggerRef={ref}
        start={SECTION_START}
        replay
      />
      {children(ref)}
    </section>
  );
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProject(id) : undefined;

  if (!project) {
    return <Navigate to="/" replace />;
  }

  // Pulled out as consts so the narrowing survives into the render-prop
  // closures below — `{project.screens && ...}` does not narrow inside them.
  const { screens, demo, photos } = project;

  // A project shows at most one hero backdrop; footage takes precedence over a
  // brand mark if an entry ever carries both.
  const showVideo = Boolean(project.heroVideo);
  const showLogo = !showVideo && Boolean(project.heroLogo);
  const heroClass = [styles.hero, showVideo && styles.hasVideo, showLogo && styles.hasLogo]
    .filter(Boolean)
    .join(' ');

  return (
    <article>
      <header className={heroClass}>
        {project.heroVideo ? (
          <HeroVideo src={project.heroVideo} />
        ) : project.heroLogo ? (
          <HeroLogo src={project.heroLogo} glow={project.heroLogoGlow} />
        ) : null}

        <div className={`container ${styles.heroInner}`}>
          <Reveal trigger="mount" y={0}>
            {/* Back to the Projects section, not the top of the home page —
                you came from that grid, so that's where "back" means. */}
            <Link to="/#projects" className={styles.back}>
              ← Back
            </Link>
          </Reveal>

          <MaskedText
            as="h1"
            text={project.title}
            className={styles.title}
            trigger="mount"
            delay={0.1}
          />
          <Reveal trigger="mount" delay={0.3}>
            <p className={styles.tagline}>{project.tagline}</p>
          </Reveal>

          {project.publication && (
            <Reveal trigger="mount" delay={0.4}>
              <p className={styles.publication}>{project.publication}</p>
            </Reveal>
          )}

          <Reveal trigger="mount" delay={0.45}>
            <ul className={styles.tech}>
              {project.tech.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal trigger="mount" delay={0.55}>
            <div className={styles.links}>
              {project.githubUrl && (
                <Magnetic>
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    GitHub repo →
                  </a>
                </Magnetic>
              )}
              {project.demoUrl && (
                <Magnetic>
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    Live demo →
                  </a>
                </Magnetic>
              )}
              {project.videoUrl && (
                <Magnetic>
                  <a href={project.videoUrl} target="_blank" rel="noreferrer">
                    Demo video →
                  </a>
                </Magnetic>
              )}
              {project.paperUrl && (
                <Magnetic>
                  <a href={project.paperUrl} target="_blank" rel="noreferrer">
                    Published paper →
                  </a>
                </Magnetic>
              )}
            </div>
          </Reveal>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {/* The Problem block is visible (or nearly so) on page open, so it joins
            the mount cascade — a scroll trigger would leave it blank until the
            user nudges the page. */}
        <section className={styles.block}>
          {/* Heading is mount-triggered too, not scroll: with the later
              SECTION_START it would sit blank on page open while its body —
              already in the mount cascade — was visible above it. */}
          <MaskedText
            as="h2"
            text="Problem"
            className={styles.heading}
            trigger="mount"
            delay={0.6}
          />
          <Reveal trigger="mount" delay={0.6 + BODY_DELAY}>
            <p>{project.problem}</p>
          </Reveal>
        </section>

        <Block heading="Approach">
          {(sectionRef) => (
            <ul className={styles.bullets}>
              {project.approach.map((point, index) => (
                <Reveal
                  as="li"
                  key={point}
                  triggerRef={sectionRef}
                  start={SECTION_START}
                  delay={BODY_DELAY + index * 0.08}
                >
                  {point}
                </Reveal>
              ))}
            </ul>
          )}
        </Block>

        {screens && (
          <Block heading="Screens" wide>
            {() => (
              <ScreenCarousel
                screens={screens}
                layout={project.screensLayout}
                framed={project.screensFramed}
                aspect={project.screensAspect}
              />
            )}
          </Block>
        )}

        <Block heading="Architecture">
          {(sectionRef) => (
            <ul className={styles.bullets}>
              {project.architecture.map((point, index) => (
                <Reveal
                  as="li"
                  key={point}
                  triggerRef={sectionRef}
                  start={SECTION_START}
                  delay={BODY_DELAY + index * 0.08}
                >
                  {point}
                </Reveal>
              ))}
            </ul>
          )}
        </Block>

        <Block heading="Results & impact">
          {(sectionRef) => (
            <ul className={styles.bullets}>
              {project.results.map((point, index) => (
                <Reveal
                  as="li"
                  key={point}
                  triggerRef={sectionRef}
                  start={SECTION_START}
                  delay={BODY_DELAY + index * 0.08}
                >
                  {point}
                </Reveal>
              ))}
            </ul>
          )}
        </Block>

        {/* No Reveal wrapper on the video: DemoVideo drives its own
            scroll-scrubbed expand, and a fade-up on top would fight it. */}
        {demo && (
          <Block heading="Demo" wide>
            {() => (
              <DemoVideo
                src={demo.src}
                poster={demo.poster}
                crop={demo.crop}
                hasAudio={demo.hasAudio}
                label={`Play the ${project.title} demo video`}
              />
            )}
          </Block>
        )}

        {/* Event photography closes the page — context about how the thing was
            built, after the product itself has been shown. */}
        {photos && (
          <Block heading="Highlights" wide>
            {() => (
              <ScreenCarousel
                screens={photos}
                layout="center"
                framed={false}
                aspect={project.photosAspect}
                label={`${project.title} photos`}
              />
            )}
          </Block>
        )}
      </div>
    </article>
  );
}
