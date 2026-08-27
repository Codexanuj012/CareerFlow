import type { LocalUser } from '../types/auth';
import type { Contact } from '../types/contact';
import type { OutreachRecord } from '../types/outreach';
import type { GmailProfile } from '../types/gmail';

const KEYS = {
  users: 'careerflow_users',
  session: 'careerflow_session',
  contacts: 'careerflow_contacts',
  outreach: 'careerflow_outreach',
  gmail: 'careerflow_gmail_profile',
  settings: 'careerflow_settings',
  seeded: 'careerflow_seeded_v1',
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

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
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
    gmail: getGmailProfile(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importData(json: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed.contacts)) saveContacts(parsed.contacts);
    if (Array.isArray(parsed.outreach)) saveOutreach(parsed.outreach);
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
