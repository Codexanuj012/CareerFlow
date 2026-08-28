import { useMemo } from 'react';
import { useOutreach } from '../hooks/useOutreach';
import { useContacts } from '../hooks/useContacts';
import { AnalyticsCards } from '../components/analytics/AnalyticsCards';
import { OutreachAnalytics } from '../components/analytics/OutreachAnalytics';
import { ContactsBySource } from '../components/analytics/ContactsBySource';
import { EmptyState } from '../components/ui/EmptyState';
import { computeDashboardStats, averageEmailsPerContact, contactsBySource } from '../services/analyticsService';

export default function Analytics() {
  const { outreach } = useOutreach();
  const { contacts } = useContacts();
  const stats = useMemo(() => computeDashboardStats(), [outreach]);
  const avgPerContact = useMemo(() => averageEmailsPerContact(), [outreach]);
  const sourceBreakdown = useMemo(() => contactsBySource(), [contacts]);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-muted">Understand how your outreach is performing.</p>
      </div>

      {outreach.length === 0 ? (
        <EmptyState title="Not enough data yet." description="Send your first outreach email to start seeing analytics." />
      ) : (
        <>
          <AnalyticsCards
            totalSent={stats.totalSent}
            uniqueContacts={stats.uniqueContacts}
            avgPerContact={avgPerContact}
            replies={stats.replies}
            responseRate={stats.responseRate}
            followUpsDue={stats.followUpsDue}
          />
                    <OutreachAnalytics />
          <ContactsBySource breakdown={sourceBreakdown} />
        </>
      )}
    </div>
  );
}
