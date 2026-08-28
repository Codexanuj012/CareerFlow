import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useOutreach } from '../hooks/useOutreach';
import { useContacts } from '../hooks/useContacts';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentOutreach } from '../components/dashboard/RecentOutreach';
import { OutreachChart } from '../components/dashboard/OutreachChart';
import { computeDashboardStats, recentOutreach, csvContactCount, latestImportDate } from '../services/analyticsService';
import { formatDate } from '../utils/formatDate';

export default function Dashboard() {
  const { user } = useAuth();
  const { outreach } = useOutreach();
  const { contacts } = useContacts();

  const stats = useMemo(() => computeDashboardStats(), [outreach]);
  const recent = useMemo(() => recentOutreach(5), [outreach]);
  const csvContacts = useMemo(() => csvContactCount(), [contacts]);
  const lastImport = useMemo(() => latestImportDate(), [contacts]);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">{greeting}, {firstName} 👋</h1>
        <p className="mt-1 text-sm text-muted">Keep your career outreach organized and intentional.</p>
      </div>

      <QuickActions />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total Sent" value={stats.totalSent} />
        <StatCard label="Unique Contacts" value={stats.uniqueContacts} />
        <StatCard label="Replies" value={stats.replies} />
        <StatCard label="Response Rate" value={`${stats.responseRate}%`} />
        <StatCard label="Follow-ups Due" value={stats.followUpsDue} tone="warning" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="CSV Contacts" value={csvContacts} />
        <StatCard label="Latest Import" value={lastImport ? formatDate(lastImport) : '—'} />
      </div>

      <OutreachChart />

      <div>
        <h2 className="mb-4 text-base font-semibold text-white">Recent Outreach</h2>
        <RecentOutreach records={recent} />
      </div>
    </div>
  );
}
