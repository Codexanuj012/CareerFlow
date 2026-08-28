import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { AdminStats } from '../components/admin/AdminStats';
import { ImportHistoryTable } from '../components/admin/ImportHistoryTable';
import { CsvImportPanel } from '../components/contacts/CsvImportPanel';
import { computeAdminStats } from '../services/analyticsService';
import * as storage from '../services/storageService';

export default function Admin() {
  const [, setRefreshKey] = useState(0);
  const stats = computeAdminStats();
  const imports = storage.getImports();

  const handleChanged = () => setRefreshKey((k) => k + 1);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Admin</h1>
        <p className="mt-1 text-sm text-muted">Manage CSV contact imports across CareerFlow.</p>
      </div>

      <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
        <p className="text-sm font-medium text-warning">Local Admin Mode</p>
        <p className="mt-1 text-sm text-muted">
          Admin permissions are stored locally in this browser because CareerFlow does not use a backend. This is
          not production-grade server-side security.
        </p>
      </div>

      <AdminStats stats={stats} />

      <Card>
        <h2 className="mb-4 text-base font-semibold text-white">Import CSV (unlimited rows)</h2>
        <CsvImportPanel onImported={handleChanged} />
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-white">Import History</h2>
        <ImportHistoryTable imports={imports} onChanged={handleChanged} />
      </Card>
    </div>
  );
}