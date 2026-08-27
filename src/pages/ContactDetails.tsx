import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { useOutreach } from '../hooks/useOutreach';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AddContactModal } from '../components/contacts/AddContactModal';
import { OutreachTimeline } from '../components/outreach/OutreachTimeline';
import { useToast } from '../components/ui/Toast';
import { timelineFor } from '../services/outreachService';
import { formatDate } from '../utils/formatDate';

export default function ContactDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts, update, remove } = useContacts();
  const { outreach } = useOutreach();
  const { showToast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const contact = contacts.find((c) => c.id === id);
  const records = useMemo(() => (contact ? timelineFor(contact.email) : []), [contact, outreach]);

  if (!contact) {
    return (
      <div className="py-16 text-center">
        <p className="text-white">Contact not found.</p>
        <Link to="/contacts" className="focus-ring mt-3 inline-block rounded text-sm font-medium text-primary">
          Back to Contacts
        </Link>
      </div>
    );
  }

  const emailsSent = records.length;
  const replies = records.filter((r) => r.status === 'replied').length;
  const lastContacted = records[0]?.sentAt;
  const firstContact = records[records.length - 1]?.sentAt;

  const handleDelete = () => {
    remove(contact.id);
    showToast('Contact deleted.', 'success');
    navigate('/contacts');
  };

  return (
    <div className="space-y-6 pb-10">
      <Link to="/contacts" className="focus-ring inline-flex items-center gap-1 rounded text-sm text-muted hover:text-white">
        ← Back to Contacts
      </Link>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={contact.name} size={56} />
            <div>
              <h1 className="text-xl font-semibold text-white">{contact.name}</h1>
              <p className="text-sm text-muted">{contact.role}{contact.role && contact.company ? ' · ' : ''}{contact.company}</p>
              <p className="text-sm text-muted">{contact.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/compose?to=${encodeURIComponent(contact.email)}`)}>Send Email</Button>
            <Button variant="secondary" onClick={() => setEditOpen(true)}>Edit Contact</Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete Contact</Button>
          </div>
        </div>

        {contact.notes && (
          <p className="mt-4 rounded-lg bg-card-secondary p-3 text-sm text-muted">{contact.notes}</p>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card secondary><p className="text-xs uppercase tracking-wide text-muted">Emails Sent</p><p className="mt-2 text-2xl font-semibold text-white">{emailsSent}</p></Card>
        <Card secondary><p className="text-xs uppercase tracking-wide text-muted">Replies</p><p className="mt-2 text-2xl font-semibold text-white">{replies}</p></Card>
        <Card secondary><p className="text-xs uppercase tracking-wide text-muted">Last Contacted</p><p className="mt-2 text-2xl font-semibold text-white">{lastContacted ? formatDate(lastContacted) : '—'}</p></Card>
        <Card secondary><p className="text-xs uppercase tracking-wide text-muted">First Contact</p><p className="mt-2 text-2xl font-semibold text-white">{firstContact ? formatDate(firstContact) : '—'}</p></Card>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-white">Email Timeline</h2>
        <OutreachTimeline records={records} />
      </Card>

      <AddContactModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={contact}
        onSave={(input) => {
          update(contact.id, input);
          showToast('Contact updated.', 'success');
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Contact"
        message={`This will permanently remove ${contact.name} from your contacts. Their outreach history will be kept.`}
        confirmLabel="Delete Contact"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
