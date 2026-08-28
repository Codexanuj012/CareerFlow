import type { LocalUser } from '../types/auth';
import type { Contact } from '../types/contact';
import type { OutreachRecord } from '../types/outreach';
import type { GmailProfile } from '../types/gmail';
import type { ImportRecord } from '../types/csv';

const KEYS = {
  users: 'careerflow_users',
  session: 'careerflow_session',
  contacts: 'careerflow_contacts',
  outreach: 'careerflow_outreach',
  gmail: 'careerflow_gmail_profile',
  settings: 'careerflow_settings',
  seeded: 'careerflow_seeded_v1',
  imports: 'careerflow_imports',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// function write<T>(key: string, value: T): void {
//   localStorage.setItem(key, JSON.stringify(value));
// }
function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Like write(), but never throws — used for bulk operations (e.g. CSV import)
// where localStorage can realistically run out of quota. Returns a result the
// caller can show to the user instead of letting the app crash.
function safeWrite<T>(key: string, value: T): { success: boolean; error?: string } {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { success: true };
  } catch (e) {
    const isQuotaError =
      e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED');
    return {
      success: false,
      error: isQuotaError
        ? 'Local storage is full. Try exporting and clearing old data, or import a smaller file.'
        : e instanceof Error
          ? e.message
          : 'Could not save data locally.',
    };
  }
}

// Users
export function getUsers(): LocalUser[] {
  return read<LocalUser[]>(KEYS.users, []);
}
export function saveUsers(users: LocalUser[]): void {
  write(KEYS.users, users);
}

// Contacts
export function getContacts(): Contact[] {
  return read<Contact[]>(KEYS.contacts, []);
}
export function saveContacts(contacts: Contact[]): void {
  write(KEYS.contacts, contacts);
}
export function getContact(id: string): Contact | undefined {
  return getContacts().find((c) => c.id === id);
}
export function addContact(contact: Contact): void {
  const contacts = getContacts();
  contacts.unshift(contact);
  saveContacts(contacts);
}
// Quota-safe variant used by bulk CSV import, which can add many rows at once.
export function saveContactsSafe(contacts: Contact[]): { success: boolean; error?: string } {
  return safeWrite(KEYS.contacts, contacts);
}
export function updateContact(id: string, patch: Partial<Contact>): void {
  const contacts = getContacts().map((c) => (c.id === id ? { ...c, ...patch } : c));
  saveContacts(contacts);
}
export function deleteContact(id: string): void {
  saveContacts(getContacts().filter((c) => c.id !== id));
}

// Outreach
export function getOutreach(): OutreachRecord[] {
  return read<OutreachRecord[]>(KEYS.outreach, []);
}
export function saveOutreach(records: OutreachRecord[]): void {
  write(KEYS.outreach, records);
}
export function addOutreach(record: OutreachRecord): void {
  const records = getOutreach();
  records.unshift(record);
  saveOutreach(records);
}

// Gmail profile (local record of "connection", token lives in memory only)
export function getGmailProfile(): GmailProfile | null {
  return read<GmailProfile | null>(KEYS.gmail, null);
}
export function saveGmailProfile(profile: GmailProfile | null): void {
  if (profile === null) {
    localStorage.removeItem(KEYS.gmail);
  } else {
    write(KEYS.gmail, profile);
  }
}

// Session
export function getSession(): { userId: string; name: string; email: string } | null {
  return read(KEYS.session, null);
}
export function saveSession(session: { userId: string; name: string; email: string } | null): void {
  if (session === null) {
    localStorage.removeItem(KEYS.session);
  } else {
    write(KEYS.session, session);
  }
}
// Imports (CSV import metadata only — the original file is never stored)
export function getImports(): ImportRecord[] {
  return read<ImportRecord[]>(KEYS.imports, []);
}
export function saveImports(imports: ImportRecord[]): void {
  write(KEYS.imports, imports);
}
export function addImport(record: ImportRecord): void {
  const imports = getImports();
  imports.unshift(record);
  saveImports(imports);
}
export function getImport(id: string): ImportRecord | undefined {
  return getImports().find((i) => i.id === id);
}
export function deleteImport(id: string): void {
  saveImports(getImports().filter((i) => i.id !== id));
}

// Settings
export interface AppSettings {
  notifications: boolean;
  theme: 'dark';
  followUpDays: number;
}
const DEFAULT_SETTINGS: AppSettings = { notifications: true, theme: 'dark', followUpDays: 4 };
export function getSettings(): AppSettings {
  return read<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
}
export function saveSettings(settings: AppSettings): void {
  write(KEYS.settings, settings);
}

// Bulk operations
export function clearAllData(): void {
  Object.values(KEYS).forEach((k) => {
    if (k !== KEYS.users && k !== KEYS.session) localStorage.removeItem(k);
  });
}

export function exportData(): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    contacts: getContacts(),
    outreach: getOutreach(),
    settings: getSettings(),
    imports: getImports(),
    gmail: getGmailProfile(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importData(json: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'This file does not look like a CareerFlow export.' };
    }
    if (Array.isArray(parsed.contacts)) saveContacts(parsed.contacts);
    if (Array.isArray(parsed.outreach)) saveOutreach(parsed.outreach);
    if (Array.isArray(parsed.imports)) saveImports(parsed.imports);
    if (parsed.settings) saveSettings(parsed.settings);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Invalid file' };
  }
}

export function isSeeded(): boolean {
  return read<boolean>(KEYS.seeded, false);
}
export function markSeeded(): void {
  write(KEYS.seeded, true);
}

export { KEYS };
