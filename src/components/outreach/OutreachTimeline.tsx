import type { OutreachRecord } from '../../types/outreach';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../utils/formatDate';

export function OutreachTimeline({ records }: { records: OutreachRecord[] }) {
  if (records.length === 0) {
    return <EmptyState title="No outreach yet." description="Compose your first email to this contact." />;
  }

  return (
    <ol className="space-y-0">
      {records.map((r, i) => (
        <li key={r.id} className="relative flex gap-4 pb-6 pl-2 last:pb-0">
          {i !== records.length - 1 && <span className="absolute left-[7px] top-5 h-full w-px bg-border" aria-hidden />}
          <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-white">{formatDate(r.sentAt)}</span>
              <StatusBadge status={r.status} />
            </div>
            <p className="mt-0.5 text-sm text-white">{r.subject}</p>
            {r.jobTitle && <p className="text-xs text-muted">{r.jobTitle}{r.company ? ` · ${r.company}` : ''}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
