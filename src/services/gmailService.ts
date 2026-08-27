import type { GmailProfile, GmailSendResult } from '../types/gmail';
import * as storage from './storageService';
import {
  isGoogleClientConfigured,
  requestGmailAccessToken,
  fetchGoogleProfile,
  revokeGoogleToken,
} from '../lib/google';

// The UI never talks to Gmail directly — everything routes through this service.
// The access token is kept in memory only (never persisted to localStorage).
let inMemoryAccessToken: string | null = null;

export function isDevelopmentMode(): boolean {
  return !isGoogleClientConfigured();
}

export function isGmailConnected(): boolean {
  return storage.getGmailProfile() !== null && inMemoryAccessToken !== null;
}

export function getGmailProfile(): GmailProfile | null {
  return storage.getGmailProfile();
}

export async function connectGmail(): Promise<{ success: boolean; error?: string }> {
  if (isDevelopmentMode()) {
    return { success: false, error: 'Google OAuth is not configured. Set VITE_GOOGLE_CLIENT_ID to enable real Gmail sending.' };
  }
  try {
    const token = await requestGmailAccessToken();
    const profile = await fetchGoogleProfile(token);
    inMemoryAccessToken = token;
    storage.saveGmailProfile({ email: profile.email, connectedAt: new Date().toISOString() });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Could not connect Gmail.' };
  }
}

export async function disconnectGmail(): Promise<void> {
  if (inMemoryAccessToken) {
    await revokeGoogleToken(inMemoryAccessToken);
  }
  inMemoryAccessToken = null;
  storage.saveGmailProfile(null);
}

function buildRawMime(params: {
  from: string;
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
}): string {
  const headers = [
    `From: ${params.from}`,
    `To: ${params.to}`,
    params.cc?.length ? `Cc: ${params.cc.join(', ')}` : '',
    params.bcc?.length ? `Bcc: ${params.bcc.join(', ')}` : '',
    `Subject: ${params.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
  ]
    .filter(Boolean)
    .join('\r\n');
  const message = `${headers}\r\n\r\n${params.html}`;
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Sends via the Gmail API. Only ever called when Gmail is actually connected.
// Never claims success unless the Gmail API confirms the send.
export async function sendEmail(params: {
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
}): Promise<GmailSendResult> {
  const profile = storage.getGmailProfile();
  if (!profile || !inMemoryAccessToken) {
    return { success: false, messageId: null, threadId: null, error: 'Gmail is not connected.' };
  }
  try {
    const raw = buildRawMime({ from: profile.email, to: params.to, cc: params.cc, bcc: params.bcc, subject: params.subject, html: params.html });
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${inMemoryAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { success: false, messageId: null, threadId: null, error: errBody?.error?.message || `Gmail API error (${res.status})` };
    }
    const data = await res.json();
    return { success: true, messageId: data.id ?? null, threadId: data.threadId ?? null };
  } catch (e) {
    return { success: false, messageId: null, threadId: null, error: e instanceof Error ? e.message : 'Network error sending email.' };
  }
}
