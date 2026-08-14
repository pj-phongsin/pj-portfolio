import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ScrollTrigger } from './lib/gsap';
import { scrollToTarget, useLenis } from './lib/useLenis';
import { Home } from './pages/Home';
import { ProjectDetail } from './pages/ProjectDetail';

/** Owns scroll position across navigation.

    A plain `<a href="/#skills">` cannot do this job: from a project page it
    triggers a full document load, the browser's native hash scroll runs before
    React has rendered the target, and the reset below then wipes the position.
    The nav uses router <Link>s so this stays a client-side transition. */
function ScrollManager() {
  // `key` changes on every navigation even when pathname and hash are
  // identical — without it, clicking a section link you're already "on"
  // (after scrolling away) would not re-run this effect and nothing happens.
  const { pathname, hash, key } = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const changedPage = previousPath.current !== pathname;
    previousPath.current = pathname;

    // Refresh before measuring: the new page's ScrollTriggers were created
    // against the old page's layout, and About's pin spacer contributes real
    // document height — reading a section's offset first would scroll to a
    // stale position.
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (target) {
        // Instant on arrival from another page, smooth for an in-page jump.
        scrollToTarget(target, !changedPage);
      } else if (changedPage) {
        scrollToTarget(0, false);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
}

function App() {
  useLenis();
  const { pathname } = useLocation();

  return (
    <>
      <ScrollManager />
      <Header />
      {/* Keyed on pathname so navigation remounts the page and replays its
          entrance animations — the "content pops in on click" effect. */}
      <main key={pathname} className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
