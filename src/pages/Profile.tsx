import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';
import { computeDashboardStats } from '../services/analyticsService';
import { formatDate } from '../utils/formatDate';

export default function Profile() {
  const { user } = useAuth();
  const stats = computeDashboardStats();

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-muted">Your CareerFlow account.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={user.name} color={user.avatarColor} size={64} />
          <div>
            <h2 className="text-lg font-semibold text-white">{user.name}</h2>
            <p className="text-sm text-muted">{user.email}</p>
            <p className="mt-1 text-xs text-muted">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card secondary><p className="text-xs uppercase tracking-wide text-muted">Total Sent</p><p className="mt-2 text-2xl font-semibold text-white">{stats.totalSent}</p></Card>
        <Card secondary><p className="text-xs uppercase tracking-wide text-muted">Contacts</p><p className="mt-2 text-2xl font-semibold text-white">{stats.uniqueContacts}</p></Card>
        <Card secondary><p className="text-xs uppercase tracking-wide text-muted">Replies</p><p className="mt-2 text-2xl font-semibold text-white">{stats.replies}</p></Card>
        <Card secondary><p className="text-xs uppercase tracking-wide text-muted">Response Rate</p><p className="mt-2 text-2xl font-semibold text-white">{stats.responseRate}%</p></Card>
      </div>
    </div>
  );
}
