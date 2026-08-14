import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import { PhoneFrame } from './PhoneFrame';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';
import { useSlideIn } from '../lib/useSlideIn';
import styles from './ScreenCarousel.module.css';

export interface Screen {
  src: string;
  caption: string;
}

interface ScreenCarouselProps {
  screens: Screen[];
  /** 'split' puts the description beside the phone; 'center' puts it beneath. */
  layout?: 'split' | 'center';
  /** false when the screenshots already carry a device frame of their own. */
  framed?: boolean;
  /** Aspect of an unframed screenshot, e.g. '640 / 1353'. */
  aspect?: string;
  /** Accessible name for the carousel, e.g. "Hackathon photos". */
  label?: string;
}

const SPRING = { type: 'spring', stiffness: 240, damping: 32, mass: 0.9 } as const;

/** Fraction of a slide the pointer must travel before a drag advances. */
const DRAG_THRESHOLD = 0.22;

/**
 * Screenshot carousel: phones on the left, the current screen's description on
 * the right. The active phone sits centred at full size with its neighbours
 * peeking, dimmed, behind the arrow buttons that flank it.
 *
 * Advances by drag, arrows, dots, or the keyboard — deliberately never on its
 * own. Positioned by transform rather than a scroll container, which keeps it
 * clear of the page's Lenis smooth scrolling entirely.
 */
export function ScreenCarousel({
  screens,
  layout = 'split',
  framed = true,
  aspect,
  label = 'App screens',
}: ScreenCarouselProps) {
  const [index, setIndex] = useState(0);
  const [metrics, setMetrics] = useState({ stride: 0, offset: 0 });
  const [reduced] = useState(prefersReducedMotion);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  // The first positioning must be a jump, not a spring from x=0 — otherwise the
  // track visibly slides in from the left once measurement lands.
  const settledRef = useRef(false);
  const x = useMotionValue(0);

  const target = metrics.offset - index * metrics.stride;

  // Slide in from the right together, as one unit. Both trigger off the
  // carousel root, not their own boxes: in the centred layout the description
  // sits below the screenshot, so per-element triggers would fire at different
  // scroll positions and they'd arrive separately whatever the delays are.
  useSlideIn(stageRef, { triggerRef: carouselRef });
  useSlideIn(infoRef, { triggerRef: carouselRef });

  // Landscape shots (desktop/browser captures) need a far wider slide than a
  // phone does. Derived from the aspect rather than another data field.
  const [aw, ah] = (aspect ?? '').split('/').map((value) => parseFloat(value));
  const orientation = aw && ah && aw > ah ? 'landscape' : 'portrait';

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () => {
      const slide = track.firstElementChild;
      if (!(slide instanceof HTMLElement)) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      setMetrics({
        stride: slide.offsetWidth + gap,
        offset: (viewport.offsetWidth - slide.offsetWidth) / 2,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!metrics.stride) return;
    if (!settledRef.current) {
      x.set(target);
      settledRef.current = true;
      return;
    }
    const controls = animate(x, target, reduced ? { duration: 0 } : SPRING);
    return () => controls.stop();
  }, [target, x, reduced, metrics.stride]);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(screens.length - 1, next));
      // Re-settling on the current slide (a drag that didn't clear the
      // threshold) leaves state unchanged, so nothing would re-render and the
      // track would stay where the drag left it — animate it back by hand.
      if (clamped === index) {
        animate(x, metrics.offset - clamped * metrics.stride, reduced ? { duration: 0 } : SPRING);
      } else {
        setIndex(clamped);
      }
    },
    [index, metrics, reduced, screens.length, x],
  );

  return (
    <div
      ref={carouselRef}
      className={styles.carousel}
      data-layout={layout}
      data-orientation={orientation}
    >
      <div className={styles.stage} ref={stageRef}>
        <div
          className={styles.viewport}
          ref={viewportRef}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={label}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              goTo(index - 1);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              goTo(index + 1);
            }
          }}
        >
          <motion.div
            ref={trackRef}
            className={styles.track}
            style={{ x }}
            drag="x"
            // Lock to the axis the gesture starts on, so a vertical swipe on
            // touch scrolls the page instead of being eaten by the carousel.
            dragDirectionLock
            // Bound to the first and last slide so the ends rubber-band instead
            // of the track being draggable off into empty space.
            dragConstraints={{
              left: metrics.offset - (screens.length - 1) * metrics.stride,
              right: metrics.offset,
            }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const threshold = metrics.stride * DRAG_THRESHOLD;
              if (info.offset.x <= -threshold) goTo(index + 1);
              else if (info.offset.x >= threshold) goTo(index - 1);
              else goTo(index);
            }}
          >
            {screens.map((screen, i) => {
              const image = (
                <img
                  src={screen.src}
                  alt={screen.caption}
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              );
              return (
                <div
                  key={screen.src}
                  className={styles.slide}
                  data-active={i === index || undefined}
                  aria-hidden={i === index ? undefined : true}
                >
                  {framed ? (
                    <PhoneFrame>{image}</PhoneFrame>
                  ) : (
                    <div className={styles.bare} style={aspect ? { aspectRatio: aspect } : undefined}>
                      {image}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous screen"
        >
          ←
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={() => goTo(index + 1)}
          disabled={index === screens.length - 1}
          aria-label="Next screen"
        >
          →
        </button>
      </div>

      <div className={styles.info} ref={infoRef}>
        <p className={styles.counter}>
          <span className={styles.current}>{String(index + 1).padStart(2, '0')}</span>
          <span className={styles.total}> / {String(screens.length).padStart(2, '0')}</span>
        </p>

        <p className={styles.caption} aria-live="polite">
          {screens[index].caption}
        </p>

        <div className={styles.dots}>
          {screens.map((screen, i) => (
            <button
              key={screen.src}
              type="button"
              className={styles.dot}
              data-active={i === index || undefined}
              onClick={() => goTo(i)}
              aria-label={screen.caption}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
