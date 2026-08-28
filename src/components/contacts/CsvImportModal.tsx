import { Modal } from '../ui/Modal';
import { CsvImportPanel } from './CsvImportPanel';
import type { ImportRecord } from '../../types/csv';

const NORMAL_USER_ROW_LIMIT = 50;

interface CsvImportModalProps {
  open: boolean;
  onClose: () => void;
  onImported: (record: ImportRecord) => void;
}

export function CsvImportModal({ open, onClose, onImported }: CsvImportModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Import Contacts from CSV" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-muted">
          Upload a CSV with at least a Name and Email column. Processing happens entirely in your browser — nothing
          is uploaded anywhere.
        </p>
        <CsvImportPanel
          maxRows={NORMAL_USER_ROW_LIMIT}
          onImported={(record) => {
            onImported(record);
            onClose();
          }}
        />
      </div>
    </Modal>
  );
}