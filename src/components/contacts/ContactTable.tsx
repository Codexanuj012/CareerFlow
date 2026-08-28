import { Link } from 'react-router-dom';
import type { Contact } from '../../types/contact';
import { Table, TableHead, TableRow, Th, Td } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../utils/formatDate';
import { emailsSentTo, lastContactedAt } from '../../services/contactService';
import { SourceBadge } from './SourceBadge';

interface ContactTableProps {
  contacts: Contact[];
  onAddClick: () => void;
}

function ContactStatus({ email }: { email: string }) {
  const count = emailsSentTo(email);
  if (count === 0) return <Badge tone="muted">Never Contacted</Badge>;
  return <Badge tone="success">Contacted</Badge>;
}

export function ContactTable({ contacts, onAddClick }: ContactTableProps) {
  if (contacts.length === 0) {
    return (
      <EmptyState
        title="No contacts yet."
        description="Add your first recruiter to start your outreach."
        action={<Button onClick={onAddClick}>+ Add Contact</Button>}
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHead>
            <tr>
              <Th>Name</Th>
              <Th>Company</Th>
              <Th>Email</Th>
              <Th>Source</Th>
              <Th>Last Contacted</Th>
              <Th>Emails Sent</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </TableHead>
          <tbody>
            {contacts.map((c) => {
              const sent = emailsSentTo(c.email);
              const last = lastContactedAt(c.email);
              return (
                <TableRow key={c.id}>
                  <Td>
                    <Link to={`/contacts/${c.id}`} className="focus-ring rounded font-medium text-white hover:text-primary">
                      {c.name}
                    </Link>
                  </Td>
                  <Td className="text-muted">{c.company || '—'}</Td>
                  <Td className="text-muted">{c.email}</Td>
                  <Td><SourceBadge source={c.source} /></Td>
                  <Td className="text-muted">{last ? formatDate(last) : '—'}</Td>
                  <Td>{sent}</Td>
                  <Td><ContactStatus email={c.email} /></Td>
                  <Td>
                    <div className="flex gap-3">
                      <Link to={`/contacts/${c.id}`} className="focus-ring rounded text-sm font-medium text-muted hover:text-white">View</Link>
                      <Link to={`/compose?to=${encodeURIComponent(c.email)}`} className="focus-ring rounded text-sm font-medium text-primary hover:text-primary-hover">Send Email</Link>
                    </div>
                  </Td>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {contacts.map((c) => {
          const sent = emailsSentTo(c.email);
          return (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link to={`/contacts/${c.id}`} className="focus-ring rounded font-medium text-white hover:text-primary">
                    {c.name}
                  </Link>
                  <p className="truncate text-xs text-muted">{c.company}</p>
                  <p className="truncate text-xs text-muted">{c.email}</p>
                  <div className="mt-1"><SourceBadge source={c.source} /></div>

                  
                </div>
                <ContactStatus email={c.email} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted">{sent} emails sent</span>
                <div className="flex gap-3">
                  <Link to={`/contacts/${c.id}`} className="focus-ring rounded text-sm font-medium text-muted hover:text-white">View</Link>
                  <Link to={`/compose?to=${encodeURIComponent(c.email)}`} className="focus-ring rounded text-sm font-medium text-primary">Send Email</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
