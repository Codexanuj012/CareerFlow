export type ContactSource = 'manual' | 'csv' | 'demo';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  notes: string;
  createdAt: string;
  source?: ContactSource;
  importId?: string | null;
  importFileName?: string | null;
  importedAt?: string | null;
}

export type ContactFilter = 'all' | 'contacted' | 'never' | 'replied' | 'followup';
export type ContactSourceFilter = 'all' | 'manual' | 'csv';