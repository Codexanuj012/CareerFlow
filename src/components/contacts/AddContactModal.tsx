import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { isValidEmail } from '../../utils/emailValidation';
import type { Contact } from '../../types/contact';

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: Omit<Contact, 'id' | 'createdAt'>) => void;
  initial?: Contact | null;
}

const EMPTY = { name: '', email: '', company: '', role: '', notes: '' };

export function AddContactModal({ open, onClose, onSave, initial }: AddContactModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(initial ? { name: initial.name, email: initial.email, company: initial.company, role: initial.role, notes: initial.notes } : EMPTY);
      setError(null);
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required.');
    if (!isValidEmail(form.email)) return setError('Enter a valid email address.');
    onSave(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Contact' : 'Add Contact'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{initial ? 'Save Changes' : 'Add Contact'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sarah Mehta" />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sarah@example.com" />
        <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Technologies" />
        <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Talent Acquisition" />
        <Textarea label="Notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes…" />
        {error && <p className="text-sm text-danger">{error}</p>}
      </form>
    </Modal>
  );
}
