import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, id, className = '', children, ...rest },
  ref
) {
  const selectId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-white">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`focus-ring w-full rounded-lg border border-border bg-card-secondary px-3.5 py-2.5 text-sm text-white transition-colors focus:border-primary ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
});
