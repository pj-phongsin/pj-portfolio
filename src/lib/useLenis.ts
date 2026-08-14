import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

/** The live instance, so overlays can suspend scrolling. Module-level rather
    than context: there is exactly one Lenis for the app, mounted once in App. */
let instance: Lenis | null = null;

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis();
    instance = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const syncLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(syncLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(syncLenis);
      instance = null;
      lenis.destroy();
    };
  }, []);
}

/** Scroll to an element (or absolute offset).

    `smooth` glides via Lenis, which is what an in-page anchor click wants.
    A cross-page arrival passes false: the home page is ~7000px tall on a
    phone, and animating that distance reads as sluggish, not smooth — it also
    fires every reveal on the way past. */
export function scrollToTarget(target: HTMLElement | number, smooth: boolean) {
  if (instance) {
    // Recompute dimensions FIRST. Lenis clamps every scroll to a cached limit
    // refreshed by a ResizeObserver, which fires asynchronously — so straight
    // after a route change it still holds the previous page's height and
    // silently caps the target. A short project page (3148px) clamped a jump
    // to #skills at 2248px instead of 4363px exactly this way.
    instance.resize();
    instance.scrollTo(target, { immediate: !smooth });
    return;
  }
  // Lenis not mounted yet (or destroyed); fall back to a native jump.
  const top =
    typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top);
}

/** Suspend/resume page scrolling for a modal overlay.

    Lenis must be stopped explicitly — it drives scrolling itself, so
    `overflow: hidden` on the body alone does NOT hold it. The body lock is
    still needed on top, because Lenis leaves touch scrolling native by
    default (syncTouch is off), and that keeps working while Lenis is stopped.
    Both levers, or the page slides under the open panel. */
export function setScrollLocked(locked: boolean, bodyClass: string) {
  if (locked) {
    instance?.stop();
    document.body.classList.add(bodyClass);
  } else {
    instance?.start();
    document.body.classList.remove(bodyClass);
  }
}
