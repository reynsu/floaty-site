import { useState } from 'react';
import { highlight } from './highlight';

type Props = {
  code: string;
  className?: string;
};

type CopyState = 'idle' | 'copied' | 'failed';

export function Code({ code, className }: Props) {
  const [state, setState] = useState<CopyState>('idle');

  const onCopy = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setState('copied');
        window.setTimeout(() => setState('idle'), 1400);
      },
      () => {
        setState('failed');
        window.setTimeout(() => setState('idle'), 1800);
      },
    );
  };

  const label =
    state === 'copied' ? '✓ copied' : state === 'failed' ? '✗ failed' : 'copy';

  return (
    <div className={`code-block ${className ?? ''}`}>
      <div className="code-actions">
        <button
          type="button"
          className={`code-copy code-copy-${state}`}
          onClick={onCopy}
          aria-label="Copy code"
        >
          {label}
        </button>
      </div>
      <pre className="code">{highlight(code)}</pre>
    </div>
  );
}
