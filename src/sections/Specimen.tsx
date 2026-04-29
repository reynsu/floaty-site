import { FloaterActionsProvider, useFloaterActions, type FloaterAction } from 'floaty';

const baseActions: FloaterAction[] = [
  { id: 'reply', label: 'Reply', onSelect: () => {} },
  { id: 'forward', label: 'Forward', onSelect: () => {} },
  { id: 'archive', label: 'Archive', onSelect: () => {} },
];

const overflowActions: FloaterAction[] = [
  ...baseActions,
  { id: 'snooze', label: 'Snooze', onSelect: () => {} },
  { id: 'label', label: 'Label', onSelect: () => {} },
  { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
];

const variants = [
  {
    fig: 'fig. 02.a',
    name: ['At rest.', null] as [string, string | null],
    desc: 'Three primary actions, no overflow. The default state.',
    meta: '3 actions',
    actions: baseActions,
    theme: undefined,
  },
  {
    fig: 'fig. 02.b',
    name: ['With ', 'overflow'] as [string, string | null],
    desc: 'Three visible actions plus a "more" button revealing three more.',
    meta: '6 actions',
    actions: overflowActions,
    theme: undefined,
  },
  {
    fig: 'fig. 02.c',
    name: ['Cream.', null] as [string, string | null],
    desc: 'Inverted palette — paper background, ink border, vermillion danger.',
    meta: 'theme · cream',
    actions: overflowActions,
    theme: 'theme-cream',
  },
  {
    fig: 'fig. 02.d',
    name: ['Glass.', null] as [string, string | null],
    desc: 'Backdrop-filter blur over the page. Translucent paper, deep shadow.',
    meta: 'theme · glass',
    actions: overflowActions,
    theme: 'theme-glass',
  },
  {
    fig: 'fig. 02.e',
    name: ['Pill.', null] as [string, string | null],
    desc: 'Vermillion ink, 999px radius, no internal rules. The dock.',
    meta: 'theme · pill',
    actions: baseActions,
    theme: 'theme-pill',
  },
];

function Row({ v }: { v: typeof variants[number] }) {
  const { show } = useFloaterActions();
  return (
    <div
      className="spec-row"
      role="button"
      tabIndex={0}
      onClick={() => show(v.actions)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') show(v.actions); }}
    >
      <span className="spec-fig">{v.fig}</span>
      <div>
        <h3 className="spec-name">
          {v.name[0]}
          {v.name[1] && <span className="accent">{v.name[1]}</span>}
        </h3>
        <p className="spec-desc">{v.desc}</p>
      </div>
      <div className="spec-meta">{v.meta}</div>
      <span className="spec-arrow" aria-hidden>→</span>
    </div>
  );
}

export function Specimen() {
  return (
    <section className="section page" id="specimen">
      <div className="section-head">
        <span className="section-no">§ 02</span>
        <div>
          <h2 className="section-title">Specimen sheet.</h2>
          <p className="section-blurb">
            A typeface needs samples; a component, specimens. Each row below is
            interactive. Click to summon the bar in that variant.
          </p>
        </div>
      </div>

      <div className="specimen">
        {variants.map((v) => (
          <FloaterActionsProvider key={v.fig} maxVisible={3} className={v.theme}>
            <Row v={v} />
          </FloaterActionsProvider>
        ))}
      </div>
    </section>
  );
}
