// Thin wrapper around Google Identity Services (GIS) token client.
// Loaded dynamically at runtime — never bundles a client secret.

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: unknown) => void;
          }) => { requestAccessToken: (opts?: { prompt?: string }) => void };
          revoke: (token: string, callback: () => void) => void;
        };
      };
    };
  }
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
}

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const SCOPE = 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email';

let scriptLoadPromise: Promise<void> | null = null;

function loadGisScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')));
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

export function isGoogleClientConfigured(): boolean {
  const id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return typeof id === 'string' && id.trim().length > 0;
}

export function getGoogleClientId(): string | undefined {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID;
}

// Requests a Gmail-send-scoped access token via the GIS token client (implicit flow).
// This never touches a client secret and never asks for the user's password.
export async function requestGmailAccessToken(): Promise<string> {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not configured.');
  }
  await loadGisScript();
  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services failed to initialize.');
  }
  return new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || 'Google did not return an access token.'));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (err) => reject(err instanceof Error ? err : new Error('Google sign-in was cancelled or failed.')),
    });
    client.requestAccessToken({ prompt: 'consent' });
  });
}

// Lightweight profile-only token, used for "Continue with Google" sign-in.
// Requests no Gmail scopes — only enough to read the user's email address.
export async function requestProfileAccessToken(): Promise<string> {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not configured.');
  }
  await loadGisScript();
  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services failed to initialize.');
  }
  return new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/userinfo.email profile',
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || 'Google did not return an access token.'));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (err) => reject(err instanceof Error ? err : new Error('Google sign-in was cancelled or failed.')),
    });
    client.requestAccessToken({ prompt: '' });
  });
}

export async function fetchGoogleProfile(accessToken: string): Promise<{ email: string; name?: string }> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Could not fetch Google profile.');
  const data = await res.json();
  return { email: data.email, name: data.name };
}

export function revokeGoogleToken(accessToken: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => resolve());
    } else {
      resolve();
    }
  });
}
