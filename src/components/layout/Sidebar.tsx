import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGmail } from '../../hooks/useGmail';
import { Avatar } from '../ui/Avatar';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: 'M3 12l9-9 9 9M5 10v10h14V10',
  },
  {
    to: '/contacts',
    label: 'Contacts',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    to: '/compose',
    label: 'Compose Email',
    icon: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z',
  },
  {
    to: '/outreach',
    label: 'Outreach',
    icon: 'M22 2 11 13M22 2l-7 20-4-9-9-4Z',
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: 'M3 3v18h18M18 17V9M13 17V5M8 17v-3',
  },
  {
    to: '/integrations',
    label: 'Integrations',
    icon: 'M9 3H5a2 2 0 0 0-2 2v4m18 0V5a2 2 0 0 0-2-2h-4m0 18h4a2 2 0 0 0 2-2v-4M3 15v4a2 2 0 0 0 2 2h4',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z',
  },
];

function NavIcon({ path }: { path: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout, isAdmin } = useAuth();
  const { connected, developmentMode } = useGmail();

  const navItems = isAdmin
    ? [...NAV_ITEMS, { to: '/admin', label: 'Admin', icon: 'M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5' }]
    : NAV_ITEMS;

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />
          </svg>
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">CareerFlow</span>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
        {navItems.map((item) => (
          // PAste Thinkgs
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <NavIcon path={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-3 border-t border-border p-4">

        {/* Profile */}
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className="focus-ring flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-white/5"
        >
          <Avatar
            name={user?.name ?? 'You'}
            color={user?.avatarColor}
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user?.name ?? 'You'}
            </p>

            <p className="truncate text-xs text-muted">
              {user?.email}
            </p>
          </div>
        </NavLink>

        {/* Gmail Status */}
        <div className="flex items-center gap-2 rounded-lg bg-card-secondary px-3 py-2 text-xs">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connected
                ? 'bg-success'
                : developmentMode
                  ? 'bg-warning'
                  : 'bg-muted'
            }`}
            aria-hidden
          />

          <span className="text-muted">
            Gmail:{' '}
            {connected
              ? 'Connected'
              : developmentMode
                ? 'Dev Mode'
                : 'Not Connected'}
          </span>
        </div>

        {/* Privacy Policy */}
        <NavLink
          to="/privacy-policy"
          onClick={onNavigate}
          className={({ isActive }) =>
            `focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="M9 12l2 2 4-4" />
          </svg>

          Privacy Policy
        </NavLink>

        {/* Logout */}
        <button
          onClick={logout}
          className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <NavIcon
            path="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
          />
          Logout
        </button>

      </div>
    </div>
  );
}