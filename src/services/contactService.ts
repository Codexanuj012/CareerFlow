import type { Contact } from '../types/contact';
import type { CsvPreviewRow, ImportRecord, ImportResult } from '../types/csv';
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
    source: input.source ?? 'manual',
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

/**
 * Applies a validated CSV preview to local storage: creates new contacts for
 * "valid" rows, optionally updates existing contacts for rows that matched
 * an existing email, and always skips invalid/blocked rows. Writes are
 * quota-safe — if localStorage runs out of space partway through, the
 * import stops and reports what it could not save rather than throwing.
 * Saves exactly one ImportRecord of metadata; the original CSV file is
 * never stored.
 */
export function importContactsFromCsv(
  rows: CsvPreviewRow[],
  options: { fileName: string; userId: string; updateExisting: boolean }
): ImportResult {
  const existing = storage.getContacts();
  const existingByEmail = new Map(existing.map((c) => [c.email.toLowerCase(), c] as const));

  const importId = crypto.randomUUID();
  const importedAt = new Date().toISOString();
  const nextContacts = [...existing];

  let addedRows = 0;
  let updatedRows = 0;
  let skippedRows = 0;

  for (const row of rows) {
    if (row.status === 'valid') {
      nextContacts.unshift({
        id: crypto.randomUUID(),
        name: row.name || row.email.split('@')[0],
        email: row.email.trim().toLowerCase(),
        company: row.company,
        role: row.role,
        notes: row.notes,
        createdAt: importedAt,
        source: 'csv',
        importId,
        importFileName: options.fileName,
        importedAt,
      });
      addedRows++;
      continue;
    }

    if (row.status === 'duplicate-existing' && options.updateExisting) {
      const match = existingByEmail.get(row.email.toLowerCase());
      if (match) {
        const index = nextContacts.findIndex((c) => c.id === match.id);
        if (index !== -1) {
          nextContacts[index] = {
            ...nextContacts[index],
            name: row.name || nextContacts[index].name,
            company: row.company || nextContacts[index].company,
            role: row.role || nextContacts[index].role,
            notes: row.notes || nextContacts[index].notes,
          };
          updatedRows++;
          continue;
        }
      }
    }

    skippedRows++;
  }

  const saveResult = storage.saveContactsSafe(nextContacts);

  const record: ImportRecord = {
    id: importId,
    fileName: options.fileName,
    importedAt,
    totalRows: rows.length,
    validRows: rows.filter((r) => r.status === 'valid').length,
    invalidRows: rows.filter((r) => r.status === 'invalid-email' || r.status === 'missing-email').length,
    duplicateRows: rows.filter((r) => r.status === 'duplicate-in-file' || r.status === 'duplicate-existing').length,
    addedRows,
    updatedRows,
    skippedRows,
    status: saveResult.success ? 'completed' : 'failed',
    userId: options.userId,
  };

  storage.addImport(record);

  if (!saveResult.success) {
    return { success: false, error: saveResult.error, record };
  }
  return { success: true, record };
}

export function deleteContactsByImport(importId: string): number {
  const contacts = storage.getContacts();
  const remaining = contacts.filter((c) => c.importId !== importId);
  const removedCount = contacts.length - remaining.length;
  storage.saveContacts(remaining);
  return removedCount;
}
