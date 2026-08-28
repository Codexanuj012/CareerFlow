import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';
import * as storage from '../services/storageService';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-white">{title}</h2>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

export default function Settings() {
  const { user, logout, refresh, isAdmin, setRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [settings, setSettings] = useState(storage.getSettings());
  const [clearOpen, setClearOpen] = useState(false);

  const handleSaveProfile = () => {
    authService.updateProfile({ name, email });
    refresh();
    showToast('Settings saved.', 'success');
  };

  const handleSaveSettings = (patch: Partial<typeof settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    storage.saveSettings(next);
    showToast('Settings saved.', 'success');
  };

  const handleExport = () => {
    const json = storage.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'careerflow-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported.', 'success');
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = storage.importData(String(reader.result));
      if (result.success) {
        showToast('Data imported successfully.', 'success');
        setSettings(storage.getSettings());
      } else {
        showToast(`Import failed: ${result.error}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearData = () => {
    storage.clearAllData();
    setClearOpen(false);
    showToast('Local data cleared.', 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your account and local data.</p>
      </div>

      <SettingsSection title="Profile">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      </SettingsSection>

      <SettingsSection title="Email">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={handleSaveProfile}>Save Changes</Button>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-white">Follow-up reminders</span>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => handleSaveSettings({ notifications: e.target.checked })}
            className="h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-card-secondary border border-border checked:bg-primary relative transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-3.5 before:w-3.5 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
          />
        </label>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <p className="text-sm text-muted">CareerFlow uses a premium dark theme by design.</p>
      </SettingsSection>

      <SettingsSection title="Data">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport}>Export Data</Button>
          <Button variant="secondary" onClick={handleImportClick}>Import Data</Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </div>
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-3">
          <p className="text-sm font-medium text-danger">Clear All Data</p>
          <p className="mt-1 text-sm text-muted">This will permanently remove your local contacts and outreach history.</p>
          <Button variant="danger" size="sm" className="mt-3" onClick={() => setClearOpen(true)}>Clear Data</Button>
        </div>
      </SettingsSection>

      {/* dcklcd */}
            <SettingsSection title="Security">
        <p className="text-sm text-muted">CareerFlow uses Local Authentication. Your credentials are hashed and stored only in this browser — not on any server.</p>

        <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card-secondary p-3">
          <span>
            <span className="block text-sm text-white">Local Admin Mode</span>
            <span className="block text-xs text-muted">
              Grants access to /admin in this browser only. Not real server-side authorization.
            </span>
          </span>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => {
              setRole(e.target.checked ? 'admin' : 'user');
              showToast(e.target.checked ? 'Admin access enabled for this browser.' : 'Admin access removed.', 'success');
            }}
            className="h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-card-secondary border border-border checked:bg-primary relative transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-3.5 before:w-3.5 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
          />
        </label>

        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </SettingsSection>
      {/* dekml */}

      <ConfirmDialog
        open={clearOpen}
        title="Clear All Data"
        message="This will permanently remove your local contacts and outreach history."
        confirmLabel="Clear Data"
        danger
        onConfirm={handleClearData}
        onCancel={() => setClearOpen(false)}
      />
    </div>
  );
}
