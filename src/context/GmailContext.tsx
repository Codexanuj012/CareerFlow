import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import * as gmailService from '../services/gmailService';
import type { GmailProfile } from '../types/gmail';

interface GmailContextValue {
  profile: GmailProfile | null;
  connected: boolean;
  developmentMode: boolean;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const GmailContext = createContext<GmailContextValue | undefined>(undefined);

export function GmailProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<GmailProfile | null>(gmailService.getGmailProfile());
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const developmentMode = gmailService.isDevelopmentMode();

  useEffect(() => {
    // The access token only ever lives in memory, so a stored profile from a
    // previous page load has no live token behind it. Clear it so the UI
    // honestly reflects that the user must reconnect rather than showing a
    // "Connected" state that can no longer actually send mail.
    if (!gmailService.isGmailConnected() && gmailService.getGmailProfile()) {
      gmailService.disconnectGmail();
      setProfile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    const result = await gmailService.connectGmail();
    if (result.success) {
      setProfile(gmailService.getGmailProfile());
    } else {
      setError(result.error ?? 'Could not connect Gmail.');
    }
    setConnecting(false);
  }, []);

  const disconnect = useCallback(async () => {
    await gmailService.disconnectGmail();
    setProfile(null);
  }, []);

  return (
    <GmailContext.Provider
      value={{
        profile,
        connected: profile !== null && gmailService.isGmailConnected(),
        developmentMode,
        connecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}
