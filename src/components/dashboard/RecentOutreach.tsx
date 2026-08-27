import { Link } from 'react-router-dom';
import type { OutreachRecord } from '../../types/outreach';
import { Table, TableHead, TableRow, Th, Td } from '../ui/Table';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime } from '../../utils/formatDate';
import { Button } from '../ui/Button';

export function RecentOutreach({ records }: { records: OutreachRecord[] }) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No outreach yet."
        description="Compose your first email."
        action={
          <Link to="/compose">
            <Button>+ Compose Email</Button>
          </Link>
        }
      />
    );
  }

  return (
    <Table>
      <TableHead>
        <tr>
          <Th>Recipient</Th>
          <Th>Company</Th>
          <Th>Subject</Th>
          <Th>Sent</Th>
          <Th>Status</Th>
          <Th>Action</Th>
        </tr>
      </TableHead>
      <tbody>
        {records.map((r) => (
          <TableRow key={r.id}>
            <Td>{r.recipient}</Td>
            <Td className="text-muted">{r.company || '—'}</Td>
            <Td>{r.subject}</Td>
            <Td className="text-muted">{formatDateTime(r.sentAt)}</Td>
            <Td><StatusBadge status={r.status} /></Td>
            <Td>
              <Link to={`/compose?to=${encodeURIComponent(r.recipient)}`} className="focus-ring rounded text-sm font-medium text-primary hover:text-primary-hover">
                Follow up
              </Link>
            </Td>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
