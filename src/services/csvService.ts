import type { CsvPreviewRow, CsvPreviewSummary, CsvRowStatus } from '../types/csv';
import type { Contact } from '../types/contact';
import { isValidEmail } from '../utils/emailValidation';

// ---------------------------------------------------------------------------
// File reading
// ---------------------------------------------------------------------------

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Could not read the file. It may be corrupted.'));
    reader.readAsText(file);
  });
}

// ---------------------------------------------------------------------------
// RFC4180-style CSV parsing (handles quoted fields, escaped quotes, CRLF/LF)
// ---------------------------------------------------------------------------

export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && next === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Drop fully-empty trailing rows.
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

// ---------------------------------------------------------------------------
// Header normalization
// ---------------------------------------------------------------------------

const HEADER_ALIASES: Record<string, string[]> = {
  name: ['name', 'full name'],
  firstName: ['first name'],
  lastName: ['last name'],
  email: ['email', 'email address'],
  company: ['company', 'company name'],
  role: ['role', 'job title', 'title'],
  phone: ['phone'],
  linkedin: ['linkedin'],
  website: ['website'],
  location: ['location'],
  notes: ['notes'],
};

export type NormalizedHeaderMap = Partial<Record<keyof typeof HEADER_ALIASES, number>>;

export function normalizeCSVHeaders(headers: string[]): NormalizedHeaderMap {
  const map: NormalizedHeaderMap = {};
  const cleaned = headers.map((h) => h.trim().toLowerCase());

  for (const canonicalKey of Object.keys(HEADER_ALIASES) as (keyof typeof HEADER_ALIASES)[]) {
    const aliases = HEADER_ALIASES[canonicalKey];
    const index = cleaned.findIndex((h) => aliases.includes(h));
    if (index !== -1) map[canonicalKey] = index;
  }

  return map;
}

// ---------------------------------------------------------------------------
// Row normalization + validation
// ---------------------------------------------------------------------------

interface RawContactRow {
  name: string;
  email: string;
  company: string;
  role: string;
  notes: string;
}

export function normalizeContact(cells: string[], headerMap: NormalizedHeaderMap): RawContactRow {
  const get = (key: keyof typeof HEADER_ALIASES): string => {
    const index = headerMap[key];
    return index === undefined ? '' : (cells[index] ?? '').trim();
  };

  const firstName = get('firstName');
  const lastName = get('lastName');
  const directName = get('name');
  const name = directName || [firstName, lastName].filter(Boolean).join(' ').trim();

  const extras: string[] = [];
  const phone = get('phone');
  const linkedin = get('linkedin');
  const website = get('website');
  const location = get('location');
  if (phone) extras.push(`Phone: ${phone}`);
  if (linkedin) extras.push(`LinkedIn: ${linkedin}`);
  if (website) extras.push(`Website: ${website}`);
  if (location) extras.push(`Location: ${location}`);
  const baseNotes = get('notes');
  const notes = [baseNotes, ...extras].filter(Boolean).join(' | ');

  return {
    name,
    email: get('email'),
    company: get('company'),
    role: get('role'),
    notes,
  };
}

function validateRow(row: RawContactRow): CsvRowStatus | null {
  if (!row.email) return 'missing-email';
  if (!isValidEmail(row.email)) return 'invalid-email';
  return null;
}

/**
 * Parses raw CSV text into preview rows: normalizes headers, validates every
 * row, and flags duplicates both within the file and against existing
 * contacts. Nothing is written to storage here — this is preview-only.
 */
export function buildCsvPreview(fileName: string, csvText: string, existingContacts: Contact[]): CsvPreviewSummary {
  const table = parseCSV(csvText);
  if (table.length === 0) {
    return { fileName, totalRows: 0, validRows: 0, invalidRows: 0, duplicateRows: 0, rows: [] };
  }

  const [headerRow, ...dataRows] = table;
  const headerMap = normalizeCSVHeaders(headerRow);

  const existingEmails = new Set(existingContacts.map((c) => c.email.toLowerCase()));
  const seenInFile = new Set<string>();

  const rows: CsvPreviewRow[] = [];
  let rowNumber = 1;

  for (const cells of dataRows) {
    rowNumber++;
    const normalized = normalizeContact(cells, headerMap);
    let status = validateRow(normalized);

    if (!status) {
      const emailKey = normalized.email.toLowerCase();
      if (seenInFile.has(emailKey)) {
        status = 'duplicate-in-file';
      } else if (existingEmails.has(emailKey)) {
        status = 'duplicate-existing';
      } else {
        status = 'valid';
        seenInFile.add(emailKey);
      }
    }

    rows.push({
      rowNumber,
      name: normalized.name,
      email: normalized.email,
      company: normalized.company,
      role: normalized.role,
      notes: normalized.notes,
      status,
    });
  }

  const validRows = rows.filter((r) => r.status === 'valid').length;
  const invalidRows = rows.filter((r) => r.status === 'invalid-email' || r.status === 'missing-email').length;
  const duplicateRows = rows.filter((r) => r.status === 'duplicate-in-file' || r.status === 'duplicate-existing').length;

  return { fileName, totalRows: rows.length, validRows, invalidRows, duplicateRows, rows };
}

// ---------------------------------------------------------------------------
// CSV export (contacts -> CSV, and a blank template)
// ---------------------------------------------------------------------------

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportContactsToCSV(contacts: Contact[]): string {
  const headers = ['Name', 'Email', 'Company', 'Role', 'Notes', 'Source'];
  const lines = [headers.join(',')];
  for (const c of contacts) {
    lines.push(
      [c.name, c.email, c.company, c.role, c.notes, c.source ?? 'manual'].map(escapeCsvField).join(',')
    );
  }
  return lines.join('\r\n');
}

export function generateCsvTemplate(): string {
  const headers = ['Name', 'Email', 'Company', 'Role', 'Phone', 'LinkedIn', 'Website', 'Location', 'Notes'];
  const example = ['Rahul Sharma', 'rahul@example.com', 'Google', 'Recruiter', '', '', '', '', ''];
  return [headers.join(','), example.map(escapeCsvField).join(',')].join('\r\n');
}

export function downloadTextFile(fileName: string, content: string, mimeType = 'text/csv;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}