import type { ReactNode } from 'react';
import styles from './PhoneFrame.module.css';

/**
 * Device shell drawn in CSS around a bare app screenshot, so gallery screens
 * match the bezelled phone in a recorded demo. The screenshots carry their own
 * status bar, so the notch sits over the empty middle of it, as on real
 * hardware.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.frame}>
      <div className={styles.screen}>
        {children}
        <span className={styles.notch} aria-hidden="true" />
      </div>
    </div>
  );
}
