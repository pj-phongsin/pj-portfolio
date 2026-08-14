import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          {profile.shortName}
        </Link>
        <div className={styles.right}>
          {/* Router <Link>s, not plain anchors: from a project page an <a> does
              a full document load and lands at the top of the home page
              instead of the section. ScrollManager handles the positioning. */}
          <nav className={styles.nav}>
            <Link to="/#about">About</Link>
            <Link to="/#experience">Experience</Link>
            <Link to="/#skills">Skills</Link>
            <Link to="/#projects">Projects</Link>
            <Link to="/#contact">Contact</Link>
          </nav>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
