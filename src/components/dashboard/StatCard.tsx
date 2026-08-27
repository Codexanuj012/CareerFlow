import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: 'default' | 'warning';
}

export function StatCard({ label, value, icon, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
        {icon}
        {label}
      </div>
      <div className={`text-3xl font-semibold ${tone === 'warning' && Number(value) > 0 ? 'text-warning' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}
