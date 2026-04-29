import { useEffect } from 'react';

/**
 * Single IntersectionObserver pass that promotes any `[data-reveal]`
 * element to `[data-reveal="in"]` once it crosses the viewport. CSS
 * handles the actual transition. Each call covers elements present at
 * mount; remount the host or call again if you add nodes dynamically.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal=""]'),
    );
    if (els.length === 0) return;

    // If the user prefers reduced motion, skip — CSS already pins to revealed.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      els.forEach((el) => el.setAttribute('data-reveal', 'in'));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'in');
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
