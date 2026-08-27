import { GmailConnectionCard } from '../components/gmail/GmailConnectionCard';

export default function Integrations() {
  return (
    <div className="max-w-2xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Integrations</h1>
        <p className="mt-1 text-sm text-muted">Connect the tools CareerFlow uses to send outreach.</p>
      </div>

      <GmailConnectionCard />
    </div>
  );
}
