import { useState } from 'react';
import { Table, TableHead, TableRow, Th, Td } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useToast } from '../ui/Toast';
import { formatDateTime } from '../../utils/formatDate';
import { deleteContactsByImport } from '../../services/contactService';
import * as storage from '../../services/storageService';
import type { ImportRecord } from '../../types/csv';

interface ImportHistoryTableProps {
  imports: ImportRecord[];
  onChanged: () => void;
}

export function ImportHistoryTable({ imports, onChanged }: ImportHistoryTableProps) {
  const { showToast } = useToast();
  const [target, setTarget] = useState<ImportRecord | null>(null);
  const [viewTarget, setViewTarget] = useState<ImportRecord | null>(null);

  if (imports.length === 0) {
    return <EmptyState title="No imports yet." description="CSV imports you run will show up here." />;
  }

  const handleDeleteRecordOnly = () => {
    if (!target) return;
    storage.deleteImport(target.id);
    showToast('Import record deleted.', 'success');
    setTarget(null);
    onChanged();
  };

  const handleDeleteWithContacts = () => {
    if (!target) return;
    const removed = deleteContactsByImport(target.id);
    storage.deleteImport(target.id);
    showToast(`Import record deleted along with ${removed} contact${removed === 1 ? '' : 's'}.`, 'success');
    setTarget(null);
    onChanged();
  };

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHead>
            <tr>
              <Th>File</Th>
              <Th>Date</Th>
              <Th>Rows</Th>
              <Th>Added</Th>
              <Th>Updated</Th>
              <Th>Skipped</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </TableHead>
          <tbody>
            {imports.map((i) => (
              <TableRow key={i.id}>
                <Td>{i.fileName}</Td>
                <Td className="text-muted">{formatDateTime(i.importedAt)}</Td>
                <Td>{i.totalRows}</Td>
                <Td className="text-success">{i.addedRows}</Td>
                <Td className="text-primary">{i.updatedRows}</Td>
                <Td className="text-muted">{i.skippedRows}</Td>
                <Td><Badge tone={i.status === 'completed' ? 'success' : 'danger'}>{i.status}</Badge></Td>
                <Td>
                  <div className="flex gap-3">
                    <button onClick={() => setViewTarget(i)} className="focus-ring rounded text-sm font-medium text-muted hover:text-white">View</button>
                    <button onClick={() => setTarget(i)} className="focus-ring rounded text-sm font-medium text-danger hover:text-danger">Delete Import</button>
                  </div>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {imports.map((i) => (
          <div key={i.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{i.fileName}</p>
                <p className="text-xs text-muted">{formatDateTime(i.importedAt)}</p>
              </div>
              <Badge tone={i.status === 'completed' ? 'success' : 'danger'}>{i.status}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted">
              {i.totalRows} rows · {i.addedRows} added · {i.updatedRows} updated · {i.skippedRows} skipped
            </p>
            <div className="mt-3 flex gap-3">
              <button onClick={() => setViewTarget(i)} className="focus-ring rounded text-sm font-medium text-muted hover:text-white">View</button>
              <button onClick={() => setTarget(i)} className="focus-ring rounded text-sm font-medium text-danger">Delete Import</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={viewTarget !== null} onClose={() => setViewTarget(null)} title="Import Details" size="sm">
        {viewTarget && (
          <div className="space-y-2 text-sm">
            <p><span className="text-muted">File:</span> <span className="text-white">{viewTarget.fileName}</span></p>
            <p><span className="text-muted">Imported:</span> <span className="text-white">{formatDateTime(viewTarget.importedAt)}</span></p>
            <p><span className="text-muted">Total Rows:</span> <span className="text-white">{viewTarget.totalRows}</span></p>
            <p><span className="text-muted">Valid Rows:</span> <span className="text-white">{viewTarget.validRows}</span></p>
            <p><span className="text-muted">Invalid Rows:</span> <span className="text-white">{viewTarget.invalidRows}</span></p>
            <p><span className="text-muted">Duplicate Rows:</span> <span className="text-white">{viewTarget.duplicateRows}</span></p>
            <p><span className="text-muted">Added:</span> <span className="text-white">{viewTarget.addedRows}</span></p>
            <p><span className="text-muted">Updated:</span> <span className="text-white">{viewTarget.updatedRows}</span></p>
            <p><span className="text-muted">Skipped:</span> <span className="text-white">{viewTarget.skippedRows}</span></p>
          </div>
        )}
      </Modal>

      <Modal
        open={target !== null}
        onClose={() => setTarget(null)}
        title="Delete Import"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button>
            <Button variant="secondary" onClick={handleDeleteRecordOnly}>Delete Import Record Only</Button>
            <Button variant="danger" onClick={handleDeleteWithContacts}>Delete Import + Contacts</Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          "Delete Import Record Only" removes this entry from your import history but keeps the contacts it added.
          "Delete Import + Contacts" also removes every contact that came from this specific import. Manually added
          contacts and your outreach history are never affected.
        </p>
      </Modal>
    </>
  );
}