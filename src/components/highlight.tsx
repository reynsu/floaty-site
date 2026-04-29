import type { ReactNode } from 'react';

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var',
  'function', 'return', 'if', 'else', 'for', 'while', 'class', 'new',
  'true', 'false', 'null', 'undefined', 'type', 'interface', 'as',
  'async', 'await', 'of', 'in', 'instanceof', 'typeof', 'void',
]);

const PATTERN = new RegExp(
  [
    String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`, // 1: comment
    String.raw`('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\`(?:[^\`\\]|\\.)*\`)`, // 2: string
    String.raw`(\b\d+(?:\.\d+)?\b)`, // 3: number
    String.raw`(<\/?[A-Za-z][A-Za-z0-9]*)`, // 4: jsx tag
    String.raw`(\b[A-Z][A-Za-z0-9]*\b)`, // 5: type/component
    String.raw`(\b[a-z_$][A-Za-z0-9_$]*(?=\s*\())`, // 6: function call
    String.raw`(\b[a-z_$][A-Za-z0-9_$]*\b)`, // 7: identifier (resolved as keyword OR plain)
  ].join('|'),
  'g',
);

export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  PATTERN.lastIndex = 0;

  while ((m = PATTERN.exec(code)) !== null) {
    if (m.index > last) {
      out.push(code.slice(last, m.index));
    }
    const text = m[0];
    let cls = '';
    if (m[1]) cls = 'tok-com';
    else if (m[2]) cls = 'tok-str';
    else if (m[3]) cls = 'tok-num';
    else if (m[4]) cls = 'tok-tag';
    else if (m[5]) cls = 'tok-type';
    else if (m[6]) cls = 'tok-fn';
    else if (m[7]) {
      cls = KEYWORDS.has(text) ? 'tok-kw' : '';
    }
    if (cls) {
      out.push(
        <span key={`t${i++}`} className={cls}>
          {text}
        </span>,
      );
    } else {
      out.push(text);
    }
    last = m.index + text.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}
