import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { useOutreach } from '../hooks/useOutreach';
import { ContactStats } from '../components/contacts/ContactStats';
import { ContactTable } from '../components/contacts/ContactTable';
import { AddContactModal } from '../components/contacts/AddContactModal';
import { SearchInput } from '../components/ui/SearchInput';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { contactStats } from '../services/analyticsService';
import { emailsSentTo, lastContactedAt, repliesFor } from '../services/contactService';
import type { ContactFilter } from '../types/contact';

const FILTERS: { value: ContactFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'never', label: 'Never Contacted' },
  { value: 'replied', label: 'Replied' },
  { value: 'followup', label: 'Follow-up Due' },
];

export default function Contacts() {
  const { contacts, create } = useContacts();
  const { outreach } = useOutreach();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [filter, setFilter] = useState<ContactFilter>('all');
  const [modalOpen, setModalOpen] = useState(searchParams.get('add') === '1');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (searchParams.get('add') === '1') setModalOpen(true);
  }, [searchParams]);

  const stats = useMemo(() => contactStats(), [contacts, outreach]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return contacts.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q);
      if (!matchesQuery) return false;

      if (filter === 'all') return true;
      const sent = emailsSentTo(c.email);
      if (filter === 'contacted') return sent > 0;
      if (filter === 'never') return sent === 0;
      if (filter === 'replied') return repliesFor(c.email) > 0;
      if (filter === 'followup') {
        const last = lastContactedAt(c.email);
        if (!last) return false;
        const daysSince = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);
        return daysSince >= 4;
      }
      return true;
    });
  }, [contacts, debouncedQuery, filter]);

  const handleAdd = (input: Parameters<typeof create>[0]) => {
    create(input);
    showToast('Contact added successfully.', 'success');
    if (searchParams.get('add')) {
      searchParams.delete('add');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    if (searchParams.get('add')) {
      searchParams.delete('add');
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contacts</h1>
          <p className="mt-1 text-sm text-muted">Manage the people you've reached out to.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Contact</Button>
      </div>

      <ContactStats {...stats} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search name, company or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`focus-ring rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ContactTable contacts={filtered} onAddClick={() => setModalOpen(true)} />

      <AddContactModal open={modalOpen} onClose={closeModal} onSave={handleAdd} />
    </div>
  );
}
