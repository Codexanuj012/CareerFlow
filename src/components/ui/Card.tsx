import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  secondary?: boolean;
}

export function Card({ children, secondary, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border ${secondary ? 'bg-card-secondary' : 'bg-card'} p-5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
