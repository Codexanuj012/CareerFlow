export type CsvRowStatus = 'valid' | 'invalid-email' | 'missing-email' | 'duplicate-in-file' | 'duplicate-existing';

export interface CsvPreviewRow {
  rowNumber: number;
  name: string;
  email: string;
  company: string;
  role: string;
  notes: string;
  status: CsvRowStatus;
}

export interface CsvPreviewSummary {
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  rows: CsvPreviewRow[];
}

export interface ImportRecord {
  id: string;
  fileName: string;
  importedAt: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  addedRows: number;
  updatedRows: number;
  skippedRows: number;
  status: 'completed' | 'failed';
  userId: string;
}

export interface ImportResult {
  success: boolean;
  error?: string;
  record?: ImportRecord;
}