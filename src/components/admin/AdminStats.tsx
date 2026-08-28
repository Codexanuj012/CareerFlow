import { StatCard } from '../dashboard/StatCard';
import { formatDate } from '../../utils/formatDate';
import type { AdminStats as AdminStatsType } from '../../services/analyticsService';

export function AdminStats({ stats }: { stats: AdminStatsType }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <StatCard label="Total Contacts" value={stats.totalContacts} />
      <StatCard label="Total CSV Imports" value={stats.totalImports} />
      <StatCard label="Total CSV Rows Imported" value={stats.totalRowsImported} />
      <StatCard label="Contacts With Email" value={stats.contactsWithEmail} />
      <StatCard label="Duplicate Contacts" value={stats.duplicateContacts} tone="warning" />
      <StatCard label="Last Import" value={stats.lastImport ? formatDate(stats.lastImport) : '—'} />
    </div>
  );
}