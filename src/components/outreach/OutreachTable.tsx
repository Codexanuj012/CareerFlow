import { Link } from 'react-router-dom';
import type { OutreachRecord } from '../../types/outreach';
import { Table, TableHead, TableRow, Th, Td } from '../ui/Table';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { formatDateTime, formatDate } from '../../utils/formatDate';

export function OutreachTable({ records }: { records: OutreachRecord[] }) {
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
    <>
      <div className="hidden md:block">
        <Table>
          <TableHead>
            <tr>
              <Th>Job</Th>
              <Th>Company</Th>
              <Th>Recipient</Th>
              <Th>Sent</Th>
              <Th>Status</Th>
              <Th>Follow-up</Th>
              <Th>Action</Th>
            </tr>
          </TableHead>
          <tbody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <Td>{r.jobTitle || '—'}</Td>
                <Td className="text-muted">{r.company || '—'}</Td>
                <Td className="text-muted">{r.recipient}</Td>
                <Td className="text-muted">{formatDateTime(r.sentAt)}</Td>
                <Td><StatusBadge status={r.status} /></Td>
                <Td className="text-muted">{r.followUpAt ? formatDate(r.followUpAt) : '—'}</Td>
                <Td>
                  <Link to={`/compose?to=${encodeURIComponent(r.recipient)}`} className="focus-ring rounded text-sm font-medium text-primary hover:text-primary-hover">
                    Follow up
                  </Link>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {records.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{r.jobTitle || r.subject}</p>
                <p className="truncate text-xs text-muted">{r.recipient}</p>
                <p className="truncate text-xs text-muted">{r.company}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted">{formatDateTime(r.sentAt)}</span>
              <Link to={`/compose?to=${encodeURIComponent(r.recipient)}`} className="focus-ring rounded text-sm font-medium text-primary">Follow up</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
