type Props = { children: React.ReactNode };

export function CodeBlock({ children }: Props) {
  return (
    <div className="code-card">
      <pre className="code">{children}</pre>
    </div>
  );
}
