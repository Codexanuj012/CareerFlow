import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className = '', ...rest },
  ref
) {
  const areaId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={areaId} className="text-sm font-medium text-white">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        className={`focus-ring w-full resize-none rounded-lg border bg-card-secondary px-3.5 py-2.5 text-sm text-white placeholder:text-muted transition-colors ${
          error ? 'border-danger' : 'border-border focus:border-primary'
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});
