# floaty-site

Showcase site for [floaty](https://github.com/reynsu/floaty) — live demos of the floating action toolbar across mobile and desktop contexts.

## Sections

- **Hero** — interactive demo
- **Features** — value props
- **Mobile** — photo gallery selection, inbox bulk actions, music quick actions
- **Desktop** — ⌘K command palette, table row selection
- **Theming** — default, dark, glass, pill
- **Quick start** — install + minimal example
- **API** — Provider props + hook surface

## Development

```bash
npm install
npm run dev
```

The site uses `react-floaty` from a sibling local directory (`file:../floater-actions`).
For deployment, switch the dependency to the published version:

```diff
- "react-floaty": "file:../floater-actions",
+ "react-floaty": "^0.1.0",
```

## Build

```bash
npm run build
npm run preview
```

## License

MIT
