import { useEffect, useMemo, useState } from 'react';
import { FloaterActionsProvider, useFloaterActions, type FloaterAction } from 'floaty';

// ─────────── i. Selection toolbar (gallery) ───────────
function GalleryDemo() {
  const photos = Array.from({ length: 12 }, (_, i) => ({ id: `g${i}`, hue: (i * 31 + 20) % 360 }));
  const [sel, setSel] = useState<Set<string>>(new Set());
  const { show, hide, open } = useFloaterActions();

  useEffect(() => {
    if (sel.size === 0) {
      if (open) hide();
      return;
    }
    const n = sel.size;
    show(
      [
        { id: 'share', label: `Share (${n})`, onSelect: () => {} },
        { id: 'album', label: 'Album', onSelect: () => {} },
        {
          id: 'delete',
          label: 'Delete',
          variant: 'danger',
          onSelect: () => setSel(new Set()),
        },
        { id: 'tag', label: 'Tag', onSelect: () => {} },
        { id: 'info', label: 'Info', onSelect: () => {} },
      ],
      { dismissOnSelect: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  const toggle = (id: string) => {
    setSel((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div>
      <div className="gallery">
        {photos.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`tile ${sel.has(p.id) ? 'selected' : ''}`}
            style={{
              background: `linear-gradient(135deg,
                oklch(70% 0.14 ${p.hue}),
                oklch(58% 0.16 ${(p.hue + 35) % 360}))`,
            }}
            aria-pressed={sel.has(p.id)}
            onClick={() => toggle(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────── ii. Command palette ───────────
function PaletteDemo() {
  const { toggle } = useFloaterActions();

  const actions = useMemo<FloaterAction[]>(
    () => [
      { id: 'new', label: 'New file', onSelect: () => {} },
      { id: 'open', label: 'Open', onSelect: () => {} },
      { id: 'find', label: 'Find', onSelect: () => {} },
      { id: 'cmd', label: 'Run command', onSelect: () => {} },
      { id: 'theme', label: 'Toggle theme', onSelect: () => {} },
      { id: 'settings', label: 'Settings', onSelect: () => {} },
      { id: 'help', label: 'Help', onSelect: () => {} },
    ],
    [],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle(actions);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, actions]);

  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <>
      <div className="editor">
        <div className="ln"><span className="num">01</span><span><span className="kw">function</span> <span className="fn">greet</span>(name) {`{`}</span></div>
        <div className="ln"><span className="num">02</span><span>  <span className="kw">return</span> <span className="str">{'`Hello, ${name}`'}</span>;</span></div>
        <div className="ln"><span className="num">03</span><span>{`}`}</span></div>
        <div className="ln"><span className="num">04</span><span>&nbsp;</span></div>
        <div className="ln"><span className="num">05</span><span><span className="kw">const</span> msg = <span className="fn">greet</span>(<span className="str">'world'</span>);</span></div>
        <div className="ln"><span className="num">06</span><span><span className="com">// → "Hello, world"</span></span></div>
      </div>
      <div className="editor-foot">
        <span>
          press <span className="kbd">{isMac ? '⌘' : 'Ctrl'}</span> <span className="kbd">K</span> to summon · esc dismisses
        </span>
        <button
          type="button"
          className="editor-link"
          onClick={() => toggle(actions)}
        >
          or click here
        </button>
      </div>
    </>
  );
}

// ─────────── iii. Inbox ───────────
type Email = { id: string; from: string; subject: string; preview: string; time: string; unread: boolean };
const initialEmails: Email[] = [
  { id: 'e1', from: 'GitHub', subject: 'Your PR was merged', preview: 'feat: add provider with external store…', time: '09:42', unread: true },
  { id: 'e2', from: 'Stripe',    subject: 'Payout completed',  preview: '$1,234.00 sent to your bank ending 4242', time: '08:15', unread: true },
  { id: 'e3', from: 'M.',        subject: 'Sunday dinner?',    preview: 'are you coming this weekend, sweetheart…', time: '07:30', unread: true },
  { id: 'e4', from: 'Linear',    subject: 'New issue assigned', preview: 'KIWI-432: Fix login redirect on Safari', time: 'Tue', unread: false },
  { id: 'e5', from: 'Figma',     subject: 'Comment on design',  preview: '"Looks great, but the spacing feels…"', time: 'Mon', unread: false },
];

function InboxDemo() {
  const [emails, setEmails] = useState(initialEmails);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const { show, hide, open } = useFloaterActions();

  useEffect(() => {
    if (sel.size === 0) {
      if (open) hide();
      return;
    }
    const n = sel.size;
    const someUnread = emails.some((e) => sel.has(e.id) && e.unread);
    show(
      [
        {
          id: 'archive',
          label: `Archive (${n})`,
          onSelect: () => {
            setEmails((prev) => prev.filter((e) => !sel.has(e.id)));
            setSel(new Set());
          },
        },
        {
          id: 'read',
          label: someUnread ? 'Mark read' : 'Mark unread',
          onSelect: () => {
            setEmails((prev) =>
              prev.map((e) => (sel.has(e.id) ? { ...e, unread: !someUnread } : e)),
            );
            setSel(new Set());
          },
        },
        { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
        { id: 'snooze', label: 'Snooze', onSelect: () => {} },
        { id: 'label',  label: 'Label',  onSelect: () => {} },
        { id: 'spam',   label: 'Spam',   variant: 'danger', onSelect: () => {} },
      ],
      { dismissOnSelect: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, emails]);

  const toggle = (id: string) => {
    setSel((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div>
      <div className="inbox">
        {emails.length === 0 ? (
          <div style={{ padding: '32px 0', fontStyle: 'italic', color: 'var(--pencil)' }}>
            — Inbox zero. —
          </div>
        ) : (
          emails.map((e) => (
            <div
              key={e.id}
              className={`row ${e.unread ? 'unread' : 'read'} ${sel.has(e.id) ? 'checked' : ''}`}
              onClick={() => toggle(e.id)}
            >
              <div className="check">{sel.has(e.id) ? '✓' : ''}</div>
              <div className="from">{e.from}</div>
              <div className="subject">{e.subject}</div>
              <div className="preview">{e.preview}</div>
              <div className="time">{e.time}</div>
            </div>
          ))
        )}
      </div>
      <div className="inbox-foot">
        <span>{emails.filter((e) => e.unread).length} unread</span>
        <span>{sel.size > 0 ? `${sel.size} selected` : 'tap a row'}</span>
      </div>
    </div>
  );
}

// ─────────── Layout ───────────
export function InUse() {
  return (
    <section className="section page" id="in-use">
      <div className="section-head">
        <span className="section-no">§ 03</span>
        <div>
          <h2 className="section-title">In use — three dispatches.</h2>
          <p className="section-blurb">
            The same component, three contexts. The bar appears at the bottom
            of the viewport — its actual fixed position, not a mockup frame.
          </p>
        </div>
      </div>

      <article className="usecase">
        <div className="usecase-head">
          <span className="usecase-roman">i.</span>
          <div>
            <h3 className="usecase-name">Selection toolbar.</h3>
            <p className="usecase-prose">
              In a photo gallery, the bar lives at the bottom edge — exactly
              where the thumb lands. Action labels include the live selection
              count. <em>Tap a tile</em> to summon.
            </p>
          </div>
        </div>
        <div className="usecase-stage">
          <span className="usecase-caption">
            <b>fig. 03.i</b> Multi-select<br />gallery, mobile.
          </span>
          <FloaterActionsProvider maxVisible={3}>
            <GalleryDemo />
          </FloaterActionsProvider>
        </div>
      </article>

      <article className="usecase">
        <div className="usecase-head">
          <span className="usecase-roman">ii.</span>
          <div>
            <h3 className="usecase-name">Command palette.</h3>
            <p className="usecase-prose">
              Bound to a keyboard shortcut, floaty becomes a command palette.
              Three lines of code. <em>Press</em> ⌘K <em>to summon, again to dismiss.</em>
            </p>
          </div>
        </div>
        <div className="usecase-stage">
          <span className="usecase-caption">
            <b>fig. 03.ii</b> Editor with<br />⌘K palette, desktop.
          </span>
          <FloaterActionsProvider maxVisible={3} className="theme-pill">
            <PaletteDemo />
          </FloaterActionsProvider>
        </div>
      </article>

      <article className="usecase">
        <div className="usecase-head">
          <span className="usecase-roman">iii.</span>
          <div>
            <h3 className="usecase-name">Bulk actions.</h3>
            <p className="usecase-prose">
              Mutating a list: each callback operates on the consumer's state.
              Floaty stays out of the way. <em>Check a row</em> to summon.
            </p>
          </div>
        </div>
        <div className="usecase-stage">
          <span className="usecase-caption">
            <b>fig. 03.iii</b> Inbox<br />bulk actions.
          </span>
          <FloaterActionsProvider maxVisible={3}>
            <InboxDemo />
          </FloaterActionsProvider>
        </div>
      </article>
    </section>
  );
}
