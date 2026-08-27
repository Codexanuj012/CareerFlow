import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = '', ...rest },
  ref
) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-white">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`focus-ring w-full rounded-lg border bg-card-secondary px-3.5 py-2.5 text-sm text-white placeholder:text-muted transition-colors ${
          error ? 'border-danger' : 'border-border focus:border-primary'
        } ${className}`}
        {...rest}
      />
      {hint && !error && <span className="text-xs text-muted">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});
