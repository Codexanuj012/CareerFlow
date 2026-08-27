import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGmail } from '../../hooks/useGmail';
import { Avatar } from '../ui/Avatar';
import { SearchInput } from '../ui/SearchInput';

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const { connected, developmentMode } = useGmail();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/contacts?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur md:px-6">
      <button
        onClick={onMenuClick}
        className="focus-ring rounded-lg p-2 text-white hover:bg-white/5 md:hidden"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <form onSubmit={handleSearch} className="hidden max-w-sm flex-1 md:block">
        <SearchInput
          placeholder="Search contacts, companies, subjects…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Global search"
        />
      </form>

      <div className="flex-1 md:hidden" />

      <div className="ml-auto flex items-center gap-3">
        <span
          className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium sm:inline-flex ${
            connected ? 'border-success/30 bg-success/10 text-success' : developmentMode ? 'border-warning/30 bg-warning/10 text-warning' : 'border-border text-muted'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-success' : developmentMode ? 'bg-warning' : 'bg-muted'}`} />
          {connected ? 'Gmail Connected' : developmentMode ? 'Development Mode' : 'Gmail Disconnected'}
        </span>

        <button className="focus-ring relative rounded-lg p-2 text-muted hover:bg-white/5 hover:text-white" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <Avatar name={user?.name ?? 'You'} color={user?.avatarColor} size={32} />
          <span className="hidden text-sm font-medium text-white lg:inline">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
