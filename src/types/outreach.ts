export type OutreachStatus = 'sent' | 'failed' | 'demo' | 'replied' | 'unknown';

export interface OutreachRecord {
  id: string;
  contactId: string | null;
  recipient: string;
  cc: string[];
  bcc: string[];
  sender: string;
  subject: string;
  body: string;
  company: string;
  jobTitle: string;
  sentAt: string;
  status: OutreachStatus;
  followUpAt: string | null;
  gmailMessageId: string | null;
  threadId: string | null;
}

export type OutreachFilter = 'all' | 'sent' | 'replied' | 'followup' | 'failed';
