# Code review — commit 231cc9a (audit fixes)

**Reviewed**: 2026-04-29
**Author**: reynsu
**Branch**: main
**Decision**: APPROVE WITH COMMENTS

## Summary
Audit-fix commit applies real accessibility, contrast, and structural improvements. No security vulnerabilities, no critical regressions. Two HIGH issues worth fixing before publishing the site (clipboard error-handling and invalid `<button>` inside `<pre>`); the rest are cleanup nits.

## Findings

### CRITICAL
None.

### HIGH

**H-1 · Clipboard API has no error handling**
- `src/sections/Hero.tsx:65` and `src/components/Code.tsx:13`
- `navigator.clipboard.writeText(...)` returns a Promise that rejects on:
  - Insecure origins (HTTP, file://, some embedded contexts)
  - iOS Safari user gesture timing edge-cases
  - Permissions denied by browser policy
- Currently the `.then()` chain has no `.catch()`. On rejection, the user clicks "copy" and **nothing happens, no error indication**.
- **Fix**: add a `.catch()` that flashes a "couldn't copy" state, OR fall back to `document.execCommand('copy')`. Minimal:
  ```ts
  navigator.clipboard.writeText(code)
    .then(() => { setCopied(true); ... })
    .catch(() => { setCopied(false); /* optionally show error */ });
  ```

**H-2 · `<button>` is not valid inside `<pre>`**
- `src/components/Code.tsx:20-30`
- `<pre>` accepts phrasing content only; `<button>` is interactive content. Browsers render it but the document is invalid per HTML spec, which can affect assistive tech traversal and validators.
- **Fix**: wrap the `<pre>` and the action bar in a sibling-level container:
  ```tsx
  <div className="code-block">
    <div className="code-actions">…</div>
    <pre className="code">{highlight(code)}</pre>
  </div>
  ```
  CSS for `.code-actions` already targets the absolute position — it just moves out of the `<pre>`. No visual change.

### MEDIUM

**M-1 · `eslint-disable-next-line react-hooks/exhaustive-deps` in two places**
- `src/sections/Examples.tsx:130` (GalleryDemo) and `:313` (InboxDemo)
- The disabled rule hides the warning that `show`/`hide`/`open` aren't in the dep array. They are stable references from `useFloaterActions` (memoized via `useCallback` in the lib), so behavior is correct — but the disable comment is a **future trap**: if the lib's hook contract changes, the bug returns silently.
- **Fix**: include the stable refs in the deps. They never change, so the effect won't re-run unnecessarily, and the lint passes:
  ```tsx
  useEffect(() => { … }, [sel, show, hide, open]);
  ```

**M-2 · External font CDNs loaded without SRI**
- `index.html:11-21`
- Fontshare and Google Fonts stylesheets are fetched without `integrity=` or `crossorigin=`. If either CDN is compromised (low probability, both are reputable), an attacker could inject CSS that exfiltrates form values via `background-image: url(data:...)` tricks or visually phish.
- **Fix**: SRI is awkward for `@font-face` stylesheets because Google rotates the file. Realistic alternative: self-host the Switzer/JetBrains Mono font files in `public/fonts/`. Lower runtime cost + integrity guaranteed.

**M-3 · `n.has(id) ? n.delete(id) : n.add(id)` ternary used for side-effects**
- `Examples.tsx:136-137, 318-319`, `Customization.tsx` (similar pattern)
- The ternary's return value (`boolean` from `delete`, `Set` from `add`) is discarded. Functionally equivalent to a more explicit `if/else`, but the pattern is a smell that lint rules flag (`@typescript-eslint/no-unused-expressions` is currently quiet because the expression is the body of an arrow function that returns the new Set — but readers do a double-take).
- **Fix**:
  ```ts
  setSel((p) => {
    const n = new Set(p);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  ```

**M-4 · CSS theme code-blocks duplicated in two places**
- Each variant in `Customization.tsx` has a `cssCode` template-string field (the code shown in the inline panel) that re-states what's already declared in `src/styles/themes.css`. If a token changes in `themes.css`, the visible code drifts.
- **Fix**: load `themes.css` as a raw text import (Vite supports `?raw` suffix), parse for the matching block, and render that. Or accept the drift risk and add a code-comment warning above each `cssCode` field.

### LOW

**L-1 · `Customization.tsx` is 477 lines** — approaches the 500-line guideline. ~290 lines are pure config (variants array). Extract to `src/data/variants.ts` if the file grows further.

**L-2 · `Hero.tsx:90-93`** uses both `<br/>` and an inline `{' '}` because the `<br>` is hidden on mobile via CSS. The reasoning is opaque from JSX alone. A one-line comment (`{/* space + br: br hides on mobile, space prevents glue */}`) would help future-me.

**L-3 · No automated tests** for any of the demo logic (multi-select gallery, inbox-archive, palette toggle). Showcase site, so optional, but a Playwright smoke test that asserts "click gallery tile → bar appears with count" would catch regressions when the floaty lib updates.

**L-4 · `previewActions` and `liveActions` are module-level constants** — fine for a one-off page, but if more variants get added with custom actions, lift to a typed function `(theme: Theme) => FloaterAction[]`.

**L-5 · The `→` glyph after row hover in old specimen styles** — leftover CSS from the editorial design lives in `global.css` (search `spec-row`). Not currently rendered. Could be deleted in a cleanup pass.

## Validation results

| Check | Result |
|---|---|
| Type check | ✓ Pass |
| Lint | Skipped (no `lint` script in package.json) |
| Tests | Skipped (none) |
| Build | ✓ Pass — 34.7 KB CSS / 176 KB JS (7.40 + 55.56 KB gzipped) |

## Files reviewed

| File | Change | Notes |
|---|---|---|
| `index.html` | Modified | +`<meta name="color-scheme">`. Clean. |
| `src/components/Topbar.tsx` | Modified | `aria-hidden=` → `aria-hidden="true"`. Clean. |
| `src/sections/API.tsx` | Modified | div → h3 conversion correct, all closing tags fixed. Clean. |
| `src/sections/Customization.tsx` | Modified | Major refactor — MiniBar button→span, h4→h3, inline styles extracted, dynamic aria-labels. Solid. |
| `src/sections/Examples.tsx` | Modified | `.demo-center` extraction, aria-hidden on glyphs, link button uses class. Has M-1, M-3. |
| `src/sections/Footer.tsx` | Modified | Inline styles extracted to classes, semantic `<nav aria-label>`. Clean. |
| `src/sections/Hero.tsx` | Modified | reduced-motion guard, aria-hidden on indicator + arrow. Has H-1. |
| `src/styles/global.css` | Modified | Token darkening, touch-target rules, ~30 new classes. Large but well-organized. |

## Decision rationale

The commit makes net-positive changes against documented audit findings. **2 HIGH issues** (H-1 clipboard, H-2 button-in-pre) should be addressed before public publish since they affect observable user behavior on real browsers. None are security-critical. **MEDIUM/LOW** are cleanup that can roll into a follow-up commit without blocking.

**Recommendation**: APPROVE WITH FOLLOW-UP — merge if it were a PR, but address H-1 and H-2 in the next commit.
