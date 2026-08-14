import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { setScrollLocked } from '../lib/useLenis';
import { MaskedText } from './MaskedText';
import styles from './MobileNav.module.css';

/** Education is included here but not in the desktop nav: it was dropped there
    because 6 links crowded the bar horizontally, and a panel is vertical. */
const SECTIONS = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#education', label: 'Education' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#contact', label: 'Contact' },
];

const SOCIAL = [
  { href: profile.linkedin, label: 'LinkedIn', external: true },
  { href: profile.github, label: 'GitHub', external: true },
  { href: `mailto:${profile.email}`, label: 'Email', external: false },
];

/** Below 680px the header's anchor nav is hidden; this is its replacement.
    Slide-in panel from the right over a dimmed backdrop. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  /** Bumped on every open so the link list remounts. <MaskedText> animates on
      mount, so a persistently-mounted panel would cascade exactly once. */
  const [openCount, setOpenCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setScrollLocked(open, styles.locked);
    return () => setScrollLocked(false, styles.locked);
  }, [open]);

  // Focus trap + Escape. The panel stays mounted for its exit transition, so
  // this only runs while it's actually open.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = () => [...panel.querySelectorAll<HTMLElement>('a[href], button')];
    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // Hand focus back to the trigger on close, but never on first render.
  useEffect(() => {
    if (wasOpen.current && !open) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  // The panel only exists below 680px; if the viewport grows past that while
  // it's open, close it so the scroll lock can't outlive the UI holding it.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia('(min-width: 681px)');
    const onChange = () => query.matches && close();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [open, close]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => {
          setOpenCount((count) => count + 1);
          setOpen(true);
        }}
      >
        <span className={styles.bars}>
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
      </button>

      {/* Portalled to <body>: the header sets backdrop-filter for its glass,
          which makes it a CONTAINING BLOCK for position: fixed descendants
          (same as transform/filter). Left in place, `inset: 0` resolved
          against the 64px-tall header, so the backdrop only covered the
          header strip and the panel was clipped to 64px tall. The portal also
          lifts the z-index out of the header's z-index: 10 stacking context. */}
      {createPortal(
        <>
          <div
            className={`${styles.backdrop}${open ? ` ${styles.backdropOpen}` : ''}`}
            onClick={close}
            aria-hidden="true"
          />

          <div
            id="mobile-nav"
            ref={panelRef}
            className={`${styles.panel}${open ? ` ${styles.panelOpen}` : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            inert={!open}
          >
            <button type="button" className={styles.close} onClick={close} aria-label="Close menu">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <nav key={openCount} className={styles.links}>
              {/* Router <Link>s so a tap from a project page is a client-side
                  transition ScrollManager can position, not a full reload
                  that lands at the top of the home page. */}
              {SECTIONS.map((section, index) => (
                <Link
                  key={section.href}
                  to={section.href}
                  onClick={close}
                  className={styles.link}
                >
                  <MaskedText text={section.label} trigger="mount" delay={index * 0.05} />
                </Link>
              ))}

              <span className={styles.divider} />

              {SOCIAL.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={styles.social}
                  /* The arrow rides inside MaskedText so it rises with the word
                     instead of hanging static while the label animates behind
                     it. aria-label keeps it out of the accessible name. */
                  aria-label={item.label}
                  {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <MaskedText
                    text={`${item.label} ↗`}
                    trigger="mount"
                    delay={(SECTIONS.length + index) * 0.05}
                  />
                </a>
              ))}
            </nav>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
