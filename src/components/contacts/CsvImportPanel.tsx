import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { useContacts } from '../../hooks/useContacts';
import { buildCsvPreview, readFileAsText, parseCSV } from '../../services/csvService';
import { importContactsFromCsv } from '../../services/contactService';
import type { CsvPreviewSummary, CsvRowStatus } from '../../types/csv';
import type { ImportRecord } from '../../types/csv';

interface CsvImportPanelProps {
  /** Row cap for normal users. Leave undefined for unlimited (admin). */
  maxRows?: number;
  onImported: (record: ImportRecord) => void;
}

const STATUS_LABEL: Record<CsvRowStatus, string> = {
  valid: 'Valid',
  'invalid-email': 'Invalid Email',
  'missing-email': 'Email Required',
  'duplicate-in-file': 'Duplicate (in file)',
  'duplicate-existing': 'Duplicate (existing)',
};

const STATUS_TONE: Record<CsvRowStatus, 'success' | 'danger' | 'warning'> = {
  valid: 'success',
  'invalid-email': 'danger',
  'missing-email': 'danger',
  'duplicate-in-file': 'warning',
  'duplicate-existing': 'warning',
};

export function CsvImportPanel({ maxRows, onImported }: CsvImportPanelProps) {
  const { user } = useAuth();
  const { contacts, refresh } = useContacts();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [summary, setSummary] = useState<CsvPreviewSummary | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setSummary(null);
    setBlockedMessage(null);
    setParseError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBlockedMessage(null);
    setParseError(null);
    setSummary(null);

    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setParseError('Please choose a .csv file.');
      return;
    }

    try {
      const text = await readFileAsText(file);
      if (!text.trim()) {
        setParseError('This CSV file is empty.');
        return;
      }

      const table = parseCSV(text);
      const dataRowCount = Math.max(0, table.length - 1);

      if (dataRowCount === 0) {
        setParseError('This CSV file has no data rows.');
        return;
      }

      if (maxRows !== undefined && dataRowCount > maxRows) {
        setBlockedMessage(
          `This file contains ${dataRowCount} rows. Normal users can import a maximum of ${maxRows} contacts per CSV file. Please upload a smaller file.`
        );
        return;
      }

      const headerMap = table[0]?.map((h) => h.trim().toLowerCase()) ?? [];
      const hasEmailColumn = headerMap.some((h) => ['email', 'email address'].includes(h));
      if (!hasEmailColumn) {
        setParseError('This CSV is missing an Email column. Add "Email" or "Email Address" and try again.');
        return;
      }

      setSummary(buildCsvPreview(file.name, text, contacts));
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'This file could not be read. It may be corrupted.');
    }
  };

  const handleImport = () => {
    if (!summary || !user) return;
    setImporting(true);
    try {
      const result = importContactsFromCsv(summary.rows, {
        fileName: summary.fileName,
        userId: user.id,
        updateExisting,
      });
      if (result.success && result.record) {
        showToast(
          `Imported ${result.record.addedRows} contact${result.record.addedRows === 1 ? '' : 's'}${
            result.record.updatedRows ? `, updated ${result.record.updatedRows}` : ''
          }.`,
          'success'
        );
        refresh();
        onImported(result.record);
        reset();
      } else {
        showToast(result.error ?? 'Import failed. Please try again.', 'error');
      }
    } catch {
      showToast('Import failed. Please try again.', 'error');
    } finally {
      setImporting(false);
    }
  };

  const hasExistingDuplicates = summary?.rows.some((r) => r.status === 'duplicate-existing') ?? false;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => inputRef.current?.click()} type="button">
          Choose CSV
        </Button>
        {summary && (
          <Button variant="ghost" onClick={reset} type="button">
            Choose a different file
          </Button>
        )}
        <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
        {maxRows !== undefined && <span className="text-xs text-muted">Max {maxRows} rows per file</span>}
      </div>

      {blockedMessage && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-3">
          <p className="text-sm font-medium text-danger">CSV Upload Limit</p>
          <p className="mt-1 text-sm text-muted">{blockedMessage}</p>
        </div>
      )}

      {parseError && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-3">
          <p className="text-sm text-danger">{parseError}</p>
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card-secondary p-3">
              <p className="text-xs text-muted">Total Rows</p>
              <p className="mt-1 text-lg font-semibold text-white">{summary.totalRows}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-secondary p-3">
              <p className="text-xs text-muted">Valid Rows</p>
              <p className="mt-1 text-lg font-semibold text-success">{summary.validRows}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-secondary p-3">
              <p className="text-xs text-muted">Invalid Rows</p>
              <p className="mt-1 text-lg font-semibold text-danger">{summary.invalidRows}</p>
            </div>
            <div className="rounded-lg border border-border bg-card-secondary p-3">
              <p className="text-xs text-muted">Duplicate Rows</p>
              <p className="mt-1 text-lg font-semibold text-warning">{summary.duplicateRows}</p>
            </div>
          </div>

          <p className="text-sm text-white">
            File: <span className="text-muted">{summary.fileName}</span>
          </p>

          <div className="max-h-72 overflow-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-card-secondary text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Company</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.rows.map((row) => (
                  <tr key={row.rowNumber} className="border-t border-border">
                    <td className="px-3 py-2 text-white">{row.name || '—'}</td>
                    <td className="px-3 py-2 text-muted">{row.email || '—'}</td>
                    <td className="px-3 py-2 text-muted">{row.company || '—'}</td>
                    <td className="px-3 py-2 text-muted">{row.role || '—'}</td>
                    <td className="px-3 py-2">
                      <Badge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasExistingDuplicates && (
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={updateExisting}
                onChange={(e) => setUpdateExisting(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-card-secondary accent-primary"
              />
              Update existing contacts instead of skipping them
            </label>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={reset} type="button">Cancel</Button>
            <Button onClick={handleImport} loading={importing} disabled={summary.validRows === 0 && !updateExisting} type="button">
              Import {summary.validRows} Contact{summary.validRows === 1 ? '' : 's'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}