import { useContext } from 'react';
import { GmailContext } from '../context/GmailContext';

export function useGmail() {
  const ctx = useContext(GmailContext);
  if (!ctx) throw new Error('useGmail must be used within GmailProvider');
  return ctx;
}
