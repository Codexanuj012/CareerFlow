import { useCallback, useEffect, useState } from 'react';
import type { Contact } from '../types/contact';
import * as contactService from '../services/contactService';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const refresh = useCallback(() => {
    setContacts(contactService.listContacts());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    (input: Omit<Contact, 'id' | 'createdAt'>) => {
      const contact = contactService.createContact(input);
      refresh();
      return contact;
    },
    [refresh]
  );

  const update = useCallback(
    (id: string, patch: Partial<Contact>) => {
      contactService.editContact(id, patch);
      refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      contactService.removeContact(id);
      refresh();
    },
    [refresh]
  );

  return { contacts, refresh, create, update, remove };
}
