import { useCallback, useEffect, useState } from 'react';
import type { OutreachRecord } from '../types/outreach';
import * as outreachService from '../services/outreachService';

export function useOutreach() {
  const [outreach, setOutreach] = useState<OutreachRecord[]>([]);

  const refresh = useCallback(() => {
    setOutreach(outreachService.listOutreach());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { outreach, refresh };
}
