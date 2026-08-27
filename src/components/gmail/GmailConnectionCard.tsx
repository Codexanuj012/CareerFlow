import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useGmail } from '../../hooks/useGmail';
import { formatRelative } from '../../utils/formatDate';

export function GmailConnectionCard() {
  const { profile, connected, developmentMode, connecting, error, connect, disconnect } = useGmail();

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card-secondary text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">Gmail</h3>
              <Badge tone={connected ? 'success' : 'muted'}>{connected ? 'Connected' : 'Not Connected'}</Badge>
            </div>
            {connected && profile ? (
              <>
                <p className="mt-1 text-sm text-white">{profile.email}</p>
                <p className="text-xs text-muted">Connected {formatRelative(profile.connectedAt)}</p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted">Connect your Gmail account to send emails directly.</p>
            )}
          </div>
        </div>

        {connected ? (
          <Button variant="danger" size="sm" onClick={disconnect}>Disconnect</Button>
        ) : (
          <Button size="sm" onClick={connect} loading={connecting} disabled={developmentMode}>Connect Gmail</Button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      <div className="mt-4 rounded-lg border border-border bg-card-secondary p-3">
        {developmentMode ? (
          <>
            <p className="text-sm font-medium text-warning">Development Mode</p>
            <p className="mt-1 text-sm text-muted">Gmail is not connected. Configure Google OAuth to enable real email sending.</p>
          </>
        ) : (
          <p className="text-sm font-medium text-success">Real Gmail Mode</p>
        )}
      </div>
    </Card>
  );
}
