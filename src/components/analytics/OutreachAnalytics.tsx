import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { computeSeries, topCompanies } from '../../services/analyticsService';

type Grouping = 'daily' | 'weekly' | 'monthly';

function groupSeries(days: number, grouping: Grouping) {
  const daily = computeSeries(days);
  if (grouping === 'daily') return daily;
  const bucketSize = grouping === 'weekly' ? 7 : 30;
  const buckets: { label: string; sent: number; replies: number; followups: number }[] = [];
  for (let i = 0; i < daily.length; i += bucketSize) {
    const slice = daily.slice(i, i + bucketSize);
    buckets.push({
      label: slice[0]?.label ?? '',
      sent: slice.reduce((s, d) => s + d.sent, 0),
      replies: slice.reduce((s, d) => s + d.replies, 0),
      followups: slice.reduce((s, d) => s + d.followups, 0),
    });
  }
  return buckets;
}

const TABS: { value: Grouping; label: string; days: number }[] = [
  { value: 'daily', label: 'Daily Outreach', days: 14 },
  { value: 'weekly', label: 'Weekly Outreach', days: 56 },
  { value: 'monthly', label: 'Monthly Outreach', days: 180 },
];

export function OutreachAnalytics() {
  const [grouping, setGrouping] = useState<Grouping>('daily');
  const tab = TABS.find((t) => t.value === grouping)!;
  const data = groupSeries(tab.days, grouping);
  const companies = topCompanies(5);

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">{tab.label}</h3>
          <div className="flex gap-1 rounded-lg border border-border bg-card-secondary p-1">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setGrouping(t.value)}
                className={`focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  grouping === t.value ? 'bg-primary text-white' : 'text-muted hover:text-white'
                }`}
              >
                {t.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#111111', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="sent" name="Sent" fill="#FF6B00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-base font-semibold text-white">Top Contacted Companies</h3>
        {companies.length === 0 ? (
          <p className="text-sm text-muted">Not enough data yet.</p>
        ) : (
          <ul className="space-y-3">
            {companies.map((c) => (
              <li key={c.company} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm text-white">{c.company}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-card-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, (c.count / companies[0].count) * 100)}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm text-muted">{c.count}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
