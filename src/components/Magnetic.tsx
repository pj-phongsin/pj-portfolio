import { type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Fraction of the cursor's offset from center that the element follows. */
  strength?: number;
}

/** Subtly pulls its child toward the cursor on hover, springing back on leave. */
export function Magnetic({ children, className, strength = 0.25 }: MagneticProps) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
