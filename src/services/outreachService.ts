import type { OutreachRecord, OutreachStatus } from '../types/outreach';
import * as storage from './storageService';

export function listOutreach(): OutreachRecord[] {
  return storage.getOutreach().sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}

export function timelineFor(email: string): OutreachRecord[] {
  const normalized = email.trim().toLowerCase();
  return listOutreach().filter((o) => o.recipient.toLowerCase() === normalized);
}

export function recordOutreach(input: Omit<OutreachRecord, 'id'>): OutreachRecord {
  const record: OutreachRecord = { ...input, id: crypto.randomUUID() };
  storage.addOutreach(record);
  return record;
}

export function updateOutreachStatus(id: string, status: OutreachStatus): void {
  const records = storage.getOutreach().map((o) => (o.id === id ? { ...o, status } : o));
  storage.saveOutreach(records);
}

export function countFor(email: string): number {
  return timelineFor(email).length;
}
