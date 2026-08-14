import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { Education } from '../components/Education';
import { Experience } from '../components/Experience';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { Skills } from '../components/Skills';

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Education />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
