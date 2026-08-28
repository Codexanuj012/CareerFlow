import { Card } from '../ui/Card';
import type { SourceBreakdown } from '../../services/analyticsService';

const LABELS: Record<keyof SourceBreakdown, string> = {
  manual: 'Manual',
  csv: 'CSV',
  demo: 'Demo',
};

const COLORS: Record<keyof SourceBreakdown, string> = {
  manual: '#FF6B00',
  csv: '#22C55E',
  demo: '#A1A1AA',
};

export function ContactsBySource({ breakdown }: { breakdown: SourceBreakdown }) {
  const total = breakdown.manual + breakdown.csv + breakdown.demo;

  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold text-white">Contacts by Source</h3>
      {total === 0 ? (
        <p className="text-sm text-muted">Not enough data yet.</p>
      ) : (
        <ul className="space-y-3">
          {(Object.keys(LABELS) as (keyof SourceBreakdown)[]).map((key) => (
            <li key={key} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-sm text-white">{LABELS[key]}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-card-secondary">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(breakdown[key] / total) * 100}%`, backgroundColor: COLORS[key] }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm text-muted">{breakdown[key]}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}