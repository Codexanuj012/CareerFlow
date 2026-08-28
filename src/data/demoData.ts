import type { Contact } from '../types/contact';
import type { OutreachRecord } from '../types/outreach';

// Fictional demo data only — no real recruiter emails.
export const DEMO_CONTACTS: Omit<Contact, 'id' | 'createdAt'>[] = [
  { name: 'Sarah Mehta', role: 'Talent Acquisition', company: 'Acme Technologies', email: 'sarah@example.com', notes: 'Met at campus drive, friendly and responsive.', source: 'demo' },
  { name: 'John Sharma', role: 'Technical Recruiter', company: 'Demo Labs', email: 'john@example.com', notes: 'Focuses on frontend roles.', source: 'demo' },
  { name: 'Priya Nair', role: 'Engineering Manager', company: 'Nimbus Cloud', email: 'priya@example.com', notes: 'Referred by a friend.', source: 'demo' },
  { name: 'Alex Chen', role: 'HR Business Partner', company: 'Bright Systems', email: 'alex@example.com', notes: '', source: 'demo' },
  { name: 'Meera Iyer', role: 'People Ops', company: 'Vertex Softworks', email: 'meera@example.com', notes: 'Prefers async follow-ups.', source: 'demo' },
];

export function buildDemoOutreach(contacts: Contact[]): Omit<OutreachRecord, 'id'>[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    {
      contactId: contacts[0]?.id ?? null,
      recipient: contacts[0]?.email ?? 'sarah@example.com',
      cc: [],
      bcc: [],
      sender: 'demo.mode@careerflow.app',
      subject: 'Application Follow-up',
      body: '<p>Hi Sarah,</p><p>Following up on my application for the Frontend Engineer role.</p>',
      company: 'Acme Technologies',
      jobTitle: 'Frontend Engineer',
      sentAt: new Date(now - day * 1).toISOString(),
      status: 'sent',
      followUpAt: new Date(now + day * 3).toISOString(),
      gmailMessageId: null,
      threadId: null,
    },
    {
      contactId: contacts[1]?.id ?? null,
      recipient: contacts[1]?.email ?? 'john@example.com',
      cc: [],
      bcc: [],
      sender: 'demo.mode@careerflow.app',
      subject: 'Frontend Developer Opportunity',
      body: '<p>Hi John,</p><p>I saw the opening for a Frontend Developer and wanted to introduce myself.</p>',
      company: 'Demo Labs',
      jobTitle: 'Frontend Developer',
      sentAt: new Date(now - day * 5).toISOString(),
      status: 'sent',
      followUpAt: null,
      gmailMessageId: null,
      threadId: null,
    },
    {
      contactId: contacts[2]?.id ?? null,
      recipient: contacts[2]?.email ?? 'priya@example.com',
      cc: [],
      bcc: [],
      sender: 'demo.mode@careerflow.app',
      subject: 'Internship Opportunity',
      body: '<p>Hi Priya,</p><p>Reaching out about internship openings at Nimbus Cloud.</p>',
      company: 'Nimbus Cloud',
      jobTitle: 'Software Intern',
      sentAt: new Date(now - day * 9).toISOString(),
      status: 'demo',
      followUpAt: null,
      gmailMessageId: null,
      threadId: null,
    },
    {
      contactId: contacts[0]?.id ?? null,
      recipient: contacts[0]?.email ?? 'sarah@example.com',
      cc: [],
      bcc: [],
      sender: 'demo.mode@careerflow.app',
      subject: 'Introduction',
      body: '<p>Hi Sarah,</p><p>Introducing myself ahead of the referral chat.</p>',
      company: 'Acme Technologies',
      jobTitle: 'Frontend Engineer',
      sentAt: new Date(now - day * 17).toISOString(),
      status: 'replied',
      followUpAt: null,
      gmailMessageId: null,
      threadId: null,
    },
  ];
}
