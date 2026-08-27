import { StatCard } from '../dashboard/StatCard';

interface Props {
  totalSent: number;
  uniqueContacts: number;
  avgPerContact: number;
  replies: number;
  responseRate: number;
  followUpsDue: number;
}

export function AnalyticsCards(props: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <StatCard label="Total Emails Sent" value={props.totalSent} />
      <StatCard label="Unique Contacts" value={props.uniqueContacts} />
      <StatCard label="Avg Emails / Contact" value={props.avgPerContact} />
      <StatCard label="Replies" value={props.replies} />
      <StatCard label="Response Rate" value={`${props.responseRate}%`} />
      <StatCard label="Follow-ups Due" value={props.followUpsDue} tone="warning" />
    </div>
  );
}
