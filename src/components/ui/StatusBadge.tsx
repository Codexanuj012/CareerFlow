import { Badge } from './Badge';
import type { OutreachStatus } from '../../types/outreach';

const toneMap: Record<OutreachStatus, 'success' | 'danger' | 'muted' | 'primary' | 'warning'> = {
  sent: 'success',
  replied: 'primary',
  demo: 'warning',
  failed: 'danger',
  unknown: 'muted',
};

export function StatusBadge({ status }: { status: OutreachStatus }) {
  return <Badge tone={toneMap[status]}>{status}</Badge>;
}
