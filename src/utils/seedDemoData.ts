import { DEMO_CONTACTS, buildDemoOutreach } from '../data/demoData';
import * as storage from '../services/storageService';

export function seedDemoDataIfNeeded(): void {
  if (storage.isSeeded()) return;
  if (storage.getContacts().length > 0 || storage.getOutreach().length > 0) {
    storage.markSeeded();
    return;
  }
  const contacts = DEMO_CONTACTS.map((c) => ({
    ...c,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }));
  storage.saveContacts(contacts);

  const outreach = buildDemoOutreach(contacts).map((o) => ({ ...o, id: crypto.randomUUID() }));
  storage.saveOutreach(outreach);

  storage.markSeeded();
}
