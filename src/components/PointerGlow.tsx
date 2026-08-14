import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';
import styles from './PointerGlow.module.css';

/**
 * Static washes making up the ambient field, as fractions of the canvas box.
 * The hero's copy sits on the left, so the field is deliberately weighted to
 * the right — that half is what the layout leaves empty. Alphas stay in the
 * same range the hero already used; this shifts where the light sits, it
 * doesn't turn it up.
 */
const AMBIENT = [
  // Main fill for the open right half — the reason this is right-weighted.
  { x: 0.74, y: 0.32, spread: 0.72, alpha: 0.205 },
  // Rides the right edge so the field doesn't fall away before the viewport
  // boundary and leave a pale strip. Centred vertically to cover the whole
  // edge, not just the lower corner.
  { x: 1.02, y: 0.5, spread: 0.62, alpha: 0.118 },
  // A trace behind the headline so the text side isn't perfectly flat.
  // Deliberately the faintest of the three — the copy is the focal point and
  // shouldn't compete with its own backdrop.
  { x: 0.14, y: 0.24, spread: 0.5, alpha: 0.086 },
];

/** Where the pointer glow sits before the pointer is ever moved. */
const REST = { x: 0.68, y: 0.42 };

/**
 * The same alpha reads very differently per theme: on charcoal the accent
 * *adds* light, on cream it *subtracts* it, so an identical value lands far
 * heavier in light mode (measured: R dropping 238 → 167 across the hero at
 * parity). Light is scaled back to keep it a backdrop rather than a panel.
 */
const THEME_INTENSITY: Record<string, number> = { dark: 1, light: 0.6 };

/** 0–1 alpha to the two-digit hex the `#rrggbbaa` colour strings need. */
function hexAlpha(value: number) {
  return Math.round(Math.max(0, Math.min(1, value)) * 255)
    .toString(16)
    .padStart(2, '0');
}

export function PointerGlow({ onDark = false }: { onDark?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // Accent colors are read from computed styles once per effect run, so the
  // effect must re-run when the theme swaps them out.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rootStyle = getComputedStyle(document.documentElement);
    // `onDark`: the glow is painted over a dark video band rather than the page
    // background, so the light-mode compensation above does not apply — at 0.6
    // it would come out ~40% too weak against footage, and the light theme's
    // darker accent would dim it further. Use the dark treatment in both themes.
    const accent =
      rootStyle.getPropertyValue(onDark ? '--accent-on-dark' : '--accent').trim() || '#20808d';
    const intensity = onDark ? 1 : (THEME_INTENSITY[theme] ?? 1);

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    // The resting position is proportional, but `target` holds absolute pixels,
    // so it has to be recomputed on resize — otherwise the bias drifts off
    // position until the pointer is moved.
    let pointerMoved = false;

    const setDefaultTarget = () => {
      target.x = width * REST.x;
      target.y = height * REST.y;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!pointerMoved) {
        setDefaultTarget();
        pointer.x = target.x;
        pointer.y = target.y;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerMoved = true;
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
    };
    window.addEventListener('pointermove', handlePointerMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Static ambient field — present from the first paint, before the pointer
      // has moved, and the layer that does the work of filling the right side.
      const reach = Math.max(width, height);
      for (const wash of AMBIENT) {
        const cx = width * wash.x;
        const cy = height * wash.y;
        const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach * wash.spread);
        ambient.addColorStop(0, `${accent}${hexAlpha(wash.alpha * intensity)}`);
        ambient.addColorStop(1, 'transparent');
        ctx.fillStyle = ambient;
        ctx.fillRect(0, 0, width, height);
      }

      // Pointer-following glow layered on top — same teal, two alpha stops.
      const radius = Math.max(width, height) * 0.5;
      const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
      gradient.addColorStop(0, `${accent}${hexAlpha(0.278 * intensity)}`);
      gradient.addColorStop(0.55, `${accent}${hexAlpha(0.141 * intensity)}`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    // Paint the first frame synchronously so the backdrop exists from the very
    // first paint — the rAF loop only takes over for motion.
    draw();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', handlePointerMove);
      };
    }

    let frame = requestAnimationFrame(function loop() {
      pointer.x += (target.x - pointer.x) * 0.08;
      pointer.y += (target.y - pointer.y) * 0.08;
      draw();
      frame = requestAnimationFrame(loop);
    });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, [theme, onDark]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
