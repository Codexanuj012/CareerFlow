import type { ReactNode } from 'react';

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'muted';

const toneClasses: Record<Tone, string> = {
  default: 'bg-white/5 text-white border-border',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  primary: 'bg-primary/10 text-primary border-primary/30',
  muted: 'bg-white/5 text-muted border-border',
};

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
