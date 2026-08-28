import { getOutreach, getContacts, getImports } from './storageService';
import type { OutreachRecord } from '../types/outreach';

export interface DashboardStats {
  totalSent: number;
  uniqueContacts: number;
  replies: number;
  responseRate: number;
  followUpsDue: number;
}

export function computeDashboardStats(): DashboardStats {
  const outreach = getOutreach();
  const totalSent = outreach.filter((o) => o.status === 'sent' || o.status === 'replied').length;
  const uniqueContacts = new Set(outreach.map((o) => o.recipient.toLowerCase())).size;
  const replies = outreach.filter((o) => o.status === 'replied').length;
  const responseRate = totalSent === 0 ? 0 : Math.round((replies / totalSent) * 1000) / 10;
  const now = Date.now();
  const followUpsDue = outreach.filter(
    (o) => o.followUpAt && new Date(o.followUpAt).getTime() <= now && o.status !== 'replied'
  ).length;
  return { totalSent, uniqueContacts, replies, responseRate, followUpsDue };
}

export interface DailyPoint {
  label: string;
  sent: number;
  replies: number;
  followups: number;
}

export function computeSeries(days: number): DailyPoint[] {
  const outreach = getOutreach();
  const points: DailyPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    const dayKey = day.toISOString().slice(0, 10);
    const label = day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const dayRecords = outreach.filter((o) => o.sentAt.slice(0, 10) === dayKey);
    points.push({
      label,
      sent: dayRecords.filter((o) => o.status === 'sent' || o.status === 'replied').length,
      replies: dayRecords.filter((o) => o.status === 'replied').length,
      followups: dayRecords.filter((o) => o.followUpAt && o.followUpAt.slice(0, 10) === dayKey).length,
    });
  }
  return points;
}

export function averageEmailsPerContact(): number {
  const outreach = getOutreach();
  const unique = new Set(outreach.map((o) => o.recipient.toLowerCase()));
  if (unique.size === 0) return 0;
  return Math.round((outreach.length / unique.size) * 10) / 10;
}

export function topCompanies(limit = 5): { company: string; count: number }[] {
  const outreach = getOutreach();
  const counts = new Map<string, number>();
  outreach.forEach((o) => {
    const key = o.company?.trim() || 'Unknown';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function contactStats() {
  const contacts = getContacts();
  const outreach = getOutreach();
  const contactedEmails = new Set(outreach.map((o) => o.recipient.toLowerCase()));
  const repliedEmails = new Set(outreach.filter((o) => o.status === 'replied').map((o) => o.recipient.toLowerCase()));
  const total = contacts.length;
  const contacted = contacts.filter((c) => contactedEmails.has(c.email.toLowerCase())).length;
  const replied = contacts.filter((c) => repliedEmails.has(c.email.toLowerCase())).length;
  const never = total - contacted;
  return { total, contacted, replied, never };
}

export function recentOutreach(limit = 5): OutreachRecord[] {
  return getOutreach()
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, limit);
}


// New file add

export function csvContactCount(): number {
  return getContacts().filter((c) => c.source === 'csv').length;
}

export function latestImportDate(): string | null {
  const imports = getImports();
  if (imports.length === 0) return null;
  return imports.slice().sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime())[0]
    .importedAt;
}

export interface SourceBreakdown {
  manual: number;
  csv: number;
  demo: number;
}

export function contactsBySource(): SourceBreakdown {
  const contacts = getContacts();
  return {
    manual: contacts.filter((c) => (c.source ?? 'manual') === 'manual').length,
    csv: contacts.filter((c) => c.source === 'csv').length,
    demo: contacts.filter((c) => c.source === 'demo').length,
  };
}

export interface AdminStats {
  totalContacts: number;
  totalImports: number;
  totalRowsImported: number;
  contactsWithEmail: number;
  duplicateContacts: number;
  lastImport: string | null;
}

export function computeAdminStats(): AdminStats {
  const contacts = getContacts();
  const imports = getImports();
  const emailCounts = new Map<string, number>();
  for (const c of contacts) {
    const key = c.email.trim().toLowerCase();
    if (!key) continue;
    emailCounts.set(key, (emailCounts.get(key) ?? 0) + 1);
  }
  const duplicateContacts = Array.from(emailCounts.values()).filter((count) => count > 1).length;

  return {
    totalContacts: contacts.length,
    totalImports: imports.length,
    totalRowsImported: imports.reduce((sum, i) => sum + i.addedRows + i.updatedRows, 0),
    contactsWithEmail: contacts.filter((c) => c.email.trim() !== '').length,
    duplicateContacts,
    lastImport: latestImportDate(),
  };
}