import { useMemo, useState } from 'react';
import { useOutreach } from '../hooks/useOutreach';
import { OutreachTable } from '../components/outreach/OutreachTable';
import { OutreachFilters } from '../components/outreach/OutreachFilters';
import { SearchInput } from '../components/ui/SearchInput';
import type { OutreachFilter } from '../types/outreach';

export default function Outreach() {
  const { outreach } = useOutreach();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<OutreachFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return outreach.filter((o) => {
      const matchesQuery =
        !q ||
        o.recipient.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q) ||
        o.subject.toLowerCase().includes(q) ||
        o.jobTitle.toLowerCase().includes(q);
      if (!matchesQuery) return false;

      if (filter === 'all') return true;
      if (filter === 'sent') return o.status === 'sent';
      if (filter === 'replied') return o.status === 'replied';
      if (filter === 'failed') return o.status === 'failed';
      if (filter === 'followup') return !!o.followUpAt && new Date(o.followUpAt).getTime() <= Date.now() && o.status !== 'replied';
      return true;
    });
  }, [outreach, query, filter]);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Outreach</h1>
        <p className="mt-1 text-sm text-muted">Every email you've sent, tracked in one place.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search email, person, company or subject..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <OutreachFilters value={filter} onChange={setFilter} />
      </div>

      <OutreachTable records={filtered} />
    </div>
  );
}
