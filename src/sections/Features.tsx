const items = [
  {
    icon: '⚡',
    klass: 'blue',
    title: '8 KB ESM, zero deps',
    body: 'No animation libraries. No icon libraries. Just React and ReactDOM as peers.',
  },
  {
    icon: '🎨',
    klass: 'purple',
    title: 'CSS-first theming',
    body: 'Override CSS custom properties. Drop in dark, glass, pill, or build your own.',
  },
  {
    icon: '🪶',
    klass: 'pink',
    title: 'Headless-friendly state',
    body: 'External store via useSyncExternalStore. Consumers re-render only when they read.',
  },
  {
    icon: '♿',
    klass: 'green',
    title: 'Accessible by default',
    body: 'WAI-ARIA toolbar, keyboard navigation, ESC + outside-click, reduced-motion safe.',
  },
];

export function Features() {
  return (
    <section id="features">
      <div className="container">
        <span className="eyebrow">Why floaty</span>
        <h2 className="section-title">Built for the things you actually ship.</h2>
        <p className="section-lead">
          Floaty is small enough that you'll forget it's there, but composable enough
          to power selection toolbars, command palettes, and contextual menus across
          your entire product.
        </p>
        <div className="features">
          {items.map((it) => (
            <div className="feature" key={it.title}>
              <div className={`feature-icon ${it.klass}`}>{it.icon}</div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
