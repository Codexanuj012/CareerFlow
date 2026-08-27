import { useEffect } from 'react';
import { useAuth } from './useAuth';
import * as storage from '../services/storageService';
import { DEMO_CONTACTS, buildDemoOutreach } from '../data/demoData';
import type { Contact } from '../types/contact';

// Seeds fictional demo data once, only after the user is signed in, so a
// brand-new local account doesn't start on a completely empty dashboard.
export function useSeedDemoData() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (storage.isSeeded()) return;
    if (storage.getContacts().length > 0 || storage.getOutreach().length > 0) {
      storage.markSeeded();
      return;
    }

    const contacts: Contact[] = DEMO_CONTACTS.map((c) => ({
      ...c,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }));
    storage.saveContacts(contacts);

    const outreach = buildDemoOutreach(contacts).map((o) => ({ ...o, id: crypto.randomUUID() }));
    storage.saveOutreach(outreach);

    storage.markSeeded();
  }, [user]);
}
