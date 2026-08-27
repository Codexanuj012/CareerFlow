import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { computeSeries } from '../../services/analyticsService';
import { Card } from '../ui/Card';

const RANGES = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
];

export function OutreachChart() {
  const [range, setRange] = useState(7);
  const data = computeSeries(range);

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white">Outreach Activity</h3>
        <div className="flex gap-1 rounded-lg border border-border bg-card-secondary p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                range === r.value ? 'bg-primary text-white' : 'text-muted hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#111111', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#A1A1AA' }} />
            <Line type="monotone" dataKey="sent" name="Emails Sent" stroke="#FF6B00" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="replies" name="Replies" stroke="#22C55E" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="followups" name="Follow-ups" stroke="#F59E0B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
