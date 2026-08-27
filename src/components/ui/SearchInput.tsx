import type { InputHTMLAttributes } from 'react';

export function SearchInput({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        className="focus-ring w-full rounded-lg border border-border bg-card-secondary py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-muted transition-colors focus:border-primary"
        {...rest}
      />
    </div>
  );
}
