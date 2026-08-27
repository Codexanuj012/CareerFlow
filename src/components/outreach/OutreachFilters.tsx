import type { OutreachFilter } from '../../types/outreach';

const FILTERS: { value: OutreachFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sent', label: 'Sent' },
  { value: 'replied', label: 'Replied' },
  { value: 'followup', label: 'Follow-up Due' },
  { value: 'failed', label: 'Failed' },
];

export function OutreachFilters({ value, onChange }: { value: OutreachFilter; onChange: (v: OutreachFilter) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`focus-ring rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            value === f.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-white'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
