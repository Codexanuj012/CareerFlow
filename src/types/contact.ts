export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  notes: string;
  createdAt: string;
}

export type ContactFilter = 'all' | 'contacted' | 'never' | 'replied' | 'followup';
