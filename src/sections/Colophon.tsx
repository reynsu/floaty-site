export function Colophon() {
  return (
    <footer className="colophon page">
      <div className="colophon-grid">
        <div className="colophon-block">
          <h4>Project</h4>
          <ul>
            <li><a href="https://github.com/reynsu/floaty" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="https://www.npmjs.com/package/floaty" target="_blank" rel="noreferrer">npm</a></li>
            <li><a href="https://github.com/reynsu/floaty/issues" target="_blank" rel="noreferrer">Issues</a></li>
            <li><a href="https://github.com/reynsu/floaty/blob/main/LICENSE" target="_blank" rel="noreferrer">License — MIT</a></li>
          </ul>
        </div>

        <div className="colophon-block">
          <h4>Contents</h4>
          <ul>
            <li><a href="#manifesto">§ 01 — Editor's note</a></li>
            <li><a href="#specimen">§ 02 — Specimen</a></li>
            <li><a href="#in-use">§ 03 — In use</a></li>
            <li><a href="#specs">§ 04 — Specifications</a></li>
            <li><a href="#field-guide">§ 05 — Field guide</a></li>
          </ul>
        </div>

        <div className="colophon-block">
          <h4>Set in</h4>
          <ul>
            <li><a href="https://fonts.google.com/specimen/Fraunces" target="_blank" rel="noreferrer">Fraunces</a><br /><em>display + body</em></li>
            <li><a href="https://fonts.google.com/specimen/JetBrains+Mono" target="_blank" rel="noreferrer">JetBrains Mono</a><br /><em>code + small caps</em></li>
          </ul>
        </div>

        <div className="colophon-block">
          <h4>By</h4>
          <ul>
            <li><a href="https://github.com/reynsu" target="_blank" rel="noreferrer">@reynsu</a></li>
            <li><em>Madrid · 2026</em></li>
          </ul>
        </div>
      </div>

      <div className="colophon-foot">
        <span>Issue 01 · v0.1.0 · April MMXXVI</span>
        <span>This site uses floaty itself — naturally.</span>
      </div>
    </footer>
  );
}
