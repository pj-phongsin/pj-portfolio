import { profile } from '../data/profile';
import { GitHubIcon, LinkedInIcon, MailIcon } from './ContactIcons';
import { Magnetic } from './Magnetic';
import { MaskedText } from './MaskedText';
import { Reveal } from './Reveal';
import styles from './Contact.module.css';

const LINKS = [
  { href: `mailto:${profile.email}`, label: profile.email, Icon: MailIcon, external: false },
  { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedInIcon, external: true },
  { href: profile.github, label: 'GitHub', Icon: GitHubIcon, external: true },
];

export function Contact() {
  return (
    <footer id="contact" className={`container section ${styles.contact}`}>
      <MaskedText as="h2" text="Let's talk" className={styles.heading} />
      <Reveal>
        {/* "developer" as well as "engineering": recruiters search the former
            more, and "graduate" is the keyword AU grad programs filter on. */}
        <p className={styles.pitch}>
          Open to graduate software developer and AI/ML engineering roles. Reach out directly, or find
          me on LinkedIn and GitHub.
        </p>
        {/* Magnetic gives the same cursor-pull the hero CTAs have; it was
            already here, but reads far more clearly on a filled pill than it
            did on underlined text. */}
        <div className={styles.links}>
          {LINKS.map(({ href, label, Icon, external }) => (
            <Magnetic key={href}>
              <a
                href={href}
                className={styles.button}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <Icon className={styles.icon} />
                {label}
              </a>
            </Magnetic>
          ))}
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} {profile.shortName}</p>
      </Reveal>
    </footer>
  );
}
