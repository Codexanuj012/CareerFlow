import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const TOOLBAR: { cmd: string; label: string; icon: string }[] = [
  { cmd: 'bold', label: 'Bold', icon: 'M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z' },
  { cmd: 'italic', label: 'Italic', icon: 'M19 4h-9M14 20H5M15 4 9 20' },
  { cmd: 'underline', label: 'Underline', icon: 'M6 3v7a6 6 0 0 0 12 0V3M4 21h16' },
  { cmd: 'insertUnorderedList', label: 'Bullets', icon: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01' },
  { cmd: 'insertOrderedList', label: 'Numbered list', icon: 'M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1' },
];

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lastValue = useRef(value);

  useEffect(() => {
    if (ref.current && value !== lastValue.current && document.activeElement !== ref.current) {
      ref.current.innerHTML = value;
      lastValue.current = value;
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    lastValue.current = html;
    onChange(html);
  };

  const handleLink = () => {
    const url = window.prompt('Enter URL');
    if (url) exec('createLink', url);
  };

  const handleClear = () => exec('removeFormat');

  return (
    <div className="rounded-lg border border-border bg-card-secondary">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2" role="toolbar" aria-label="Formatting">
        {TOOLBAR.map((t) => (
          <button
            key={t.cmd}
            type="button"
            onClick={() => exec(t.cmd)}
            aria-label={t.label}
            title={t.label}
            className="focus-ring rounded-md p-2 text-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon} />
            </svg>
          </button>
        ))}
        <button type="button" onClick={handleLink} aria-label="Insert link" title="Insert link" className="focus-ring rounded-md p-2 text-muted transition-colors hover:bg-white/5 hover:text-white">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
        <span className="mx-1 h-4 w-px bg-border" />
        <button type="button" onClick={handleClear} title="Clear formatting" className="focus-ring rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-white/5 hover:text-white">
          Clear
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Email body"
        data-placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[220px] w-full px-3.5 py-3 text-sm text-white outline-none [&:empty]:before:text-muted [&:empty]:before:content-[attr(data-placeholder)]"
        suppressContentEditableWarning
      />
    </div>
  );
}
