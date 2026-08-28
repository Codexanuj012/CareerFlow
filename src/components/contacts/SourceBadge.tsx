import { Badge } from '../ui/Badge';
import type { ContactSource } from '../../types/contact';

export function SourceBadge({ source }: { source?: ContactSource }) {
  if (source === 'csv') return <Badge tone="primary">CSV</Badge>;
  if (source === 'demo') return <Badge tone="muted">Demo</Badge>;
  return <Badge tone="default">Manual</Badge>;
}