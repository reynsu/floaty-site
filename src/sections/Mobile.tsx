import { useEffect, useState } from 'react';
import { FloaterActionsProvider, useFloaterActions, type FloaterAction } from 'floaty';

// ─────────── 1. Photo gallery ───────────
function GalleryInner() {
  const photos = Array.from({ length: 9 }, (_, i) => ({ id: `g${i}`, hue: (i * 41) % 360 }));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { show, hide, open } = useFloaterActions();

  useEffect(() => {
    if (selected.size === 0) {
      if (open) hide();
      return;
    }
    const n = selected.size;
    const actions: FloaterAction[] = [
      { id: 'share', label: `Share (${n})`, onSelect: () => {} },
      { id: 'album', label: 'Album', onSelect: () => {} },
      { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => setSelected(new Set()) },
      { id: 'tag', label: 'Tag', onSelect: () => {} },
      { id: 'info', label: 'Info', onSelect: () => {} },
    ];
    show(actions, { dismissOnSelect: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const toggle = (id: string) => {
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="phone">
      <div className="phone-content">
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Photos</div>
        <div className="gallery-mini">
          {photos.map((p) => (
            <div
              key={p.id}
              className={`tile ${selected.has(p.id) ? 'selected' : ''}`}
              style={{
                background: `linear-gradient(135deg,
                  hsl(${p.hue} 70% 70%),
                  hsl(${(p.hue + 40) % 360} 65% 60%))`,
              }}
              onClick={() => toggle(p.id)}
            />
          ))}
        </div>
        <div style={{ marginTop: 'auto', fontSize: 10, color: 'var(--fg-faint)', textAlign: 'center' }}>
          {selected.size > 0 ? `${selected.size} selected` : 'Tap to select'}
        </div>
      </div>
    </div>
  );
}

// ─────────── 2. Inbox ───────────
type Email = { id: string; from: string; preview: string; unread: boolean };
const initialEmails: Email[] = [
  { id: 'e1', from: 'GitHub', preview: 'Your PR was merged', unread: true },
  { id: 'e2', from: 'Stripe', preview: 'Payout completed', unread: true },
  { id: 'e3', from: 'Mom', preview: 'Sunday dinner?', unread: true },
  { id: 'e4', from: 'Linear', preview: 'New issue assigned', unread: false },
];

function InboxInner() {
  const [emails, setEmails] = useState(initialEmails);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const { show, hide, open } = useFloaterActions();

  useEffect(() => {
    if (checked.size === 0) {
      if (open) hide();
      return;
    }
    const n = checked.size;
    show(
      [
        {
          id: 'archive',
          label: `Archive (${n})`,
          onSelect: () => {
            setEmails((prev) => prev.filter((e) => !checked.has(e.id)));
            setChecked(new Set());
          },
        },
        { id: 'read', label: 'Read', onSelect: () => {} },
        { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
        { id: 'snooze', label: 'Snooze', onSelect: () => {} },
        { id: 'spam', label: 'Spam', variant: 'danger', onSelect: () => {} },
      ],
      { dismissOnSelect: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const toggle = (id: string) => {
    setChecked((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="phone">
      <div className="phone-content">
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Inbox</div>
        <div className="inbox-mini">
          {emails.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, fontSize: 11, color: 'var(--fg-faint)' }}>
              📭 Inbox zero
            </div>
          ) : (
            emails.map((e) => (
              <div
                key={e.id}
                className={`row ${checked.has(e.id) ? 'selected' : ''}`}
                onClick={() => toggle(e.id)}
              >
                <div className="check">{checked.has(e.id) ? '✓' : ''}</div>
                <div className="meta">
                  <div className="from">{e.unread ? '● ' : ''}{e.from}</div>
                  <div className="preview">{e.preview}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ marginTop: 'auto', fontSize: 10, color: 'var(--fg-faint)', textAlign: 'center', paddingTop: 8 }}>
          {checked.size > 0 ? `${checked.size} selected` : 'Tap to select'}
        </div>
      </div>
    </div>
  );
}

// ─────────── 3. Music player ───────────
function MusicInner() {
  const { show } = useFloaterActions();
  return (
    <div className="phone">
      <div className="phone-content">
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Now playing</div>
        <div className="music-mini">
          <div className="music-art" />
          <div>
            <div className="music-title">Solar Sailor</div>
            <div className="music-artist">Daft Punk · TRON</div>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: 11, padding: '6px 12px' }}
            onClick={() =>
              show([
                { id: 'add', label: 'Add to playlist', onSelect: () => {} },
                { id: 'queue', label: 'Queue next', onSelect: () => {} },
                { id: 'share', label: 'Share', onSelect: () => {} },
                { id: 'lyrics', label: 'Lyrics', onSelect: () => {} },
                { id: 'radio', label: 'Start radio', onSelect: () => {} },
              ])
            }
          >
            More
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────── Layout ───────────
export function Mobile() {
  return (
    <section id="mobile">
      <div className="container">
        <span className="eyebrow">On mobile</span>
        <h2 className="section-title">Selection toolbars without the boilerplate.</h2>
        <p className="section-lead">
          The floating bar slides in from the bottom edge — exactly where the user's
          thumb lands. Reactive labels, count-aware, dismissable with a tap outside.
        </p>

        <div className="demo-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="demo-card">
            <h3>Photo gallery</h3>
            <p className="demo-desc">Multi-select with count-aware labels and overflow.</p>
            <div className="demo-stage">
              <FloaterActionsProvider maxVisible={3}>
                <GalleryInner />
              </FloaterActionsProvider>
            </div>
          </div>

          <div className="demo-card">
            <h3>Bulk inbox actions</h3>
            <p className="demo-desc">Archive, label, mark read — actions that mutate the list.</p>
            <div className="demo-stage">
              <FloaterActionsProvider maxVisible={3}>
                <InboxInner />
              </FloaterActionsProvider>
            </div>
          </div>

          <div className="demo-card">
            <h3>Quick actions</h3>
            <p className="demo-desc">A "more" button that surfaces five actions on demand.</p>
            <div className="demo-stage">
              <FloaterActionsProvider maxVisible={3}>
                <MusicInner />
              </FloaterActionsProvider>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          #mobile .demo-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
