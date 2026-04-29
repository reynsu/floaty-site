import { useState } from 'react';
import { highlight } from './highlight';

type Props = {
  code: string;
  className?: string;
};

export function Code({ code, className }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <pre className={`code ${className ?? ''}`}>
      <div className="code-actions">
        <button
          type="button"
          className={`code-copy ${copied ? 'copied' : ''}`}
          onClick={onCopy}
          aria-label="Copy code"
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      {highlight(code)}
    </pre>
  );
}
