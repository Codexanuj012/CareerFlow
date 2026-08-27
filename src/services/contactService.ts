import type { Contact } from '../types/contact';
import * as storage from './storageService';
import { getOutreach } from './storageService';

export function listContacts(): Contact[] {
  return storage.getContacts();
}

export function getContactById(id: string): Contact | undefined {
  return storage.getContact(id);
}

export function createContact(input: Omit<Contact, 'id' | 'createdAt'>): Contact {
  const contact: Contact = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  storage.addContact(contact);
  return contact;
}

export function editContact(id: string, patch: Partial<Contact>): void {
  storage.updateContact(id, patch);
}

export function removeContact(id: string): void {
  storage.deleteContact(id);
}

export function findContactByEmail(email: string): Contact | undefined {
  const normalized = email.trim().toLowerCase();
  return storage.getContacts().find((c) => c.email.toLowerCase() === normalized);
}

export function emailsSentTo(email: string): number {
  const normalized = email.trim().toLowerCase();
  return getOutreach().filter((o) => o.recipient.toLowerCase() === normalized).length;
}

export function lastContactedAt(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  const records = getOutreach()
    .filter((o) => o.recipient.toLowerCase() === normalized)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  return records[0]?.sentAt ?? null;
}

export function firstContactedAt(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  const records = getOutreach()
    .filter((o) => o.recipient.toLowerCase() === normalized)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  return records[0]?.sentAt ?? null;
}

export function repliesFor(email: string): number {
  const normalized = email.trim().toLowerCase();
  return getOutreach().filter((o) => o.recipient.toLowerCase() === normalized && o.status === 'replied').length;
}
