import { StatCard } from '../dashboard/StatCard';

interface Props {
  total: number;
  contacted: number;
  replied: number;
  never: number;
}

export function ContactStats({ total, contacted, replied, never }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total Contacts" value={total} />
      <StatCard label="Contacted" value={contacted} />
      <StatCard label="Replied" value={replied} />
      <StatCard label="Never Contacted" value={never} />
    </div>
  );
}
