import type { LocalUser } from '../types/auth';
import * as storage from './storageService';

// NOTE: This is Local Authentication for frontend demo purposes only.
// It is NOT production-grade server authentication. Passwords are hashed
// client-side with a simple digest purely to avoid storing plaintext in
// localStorage — this offers no real security guarantee.
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function genId(): string {
  return crypto.randomUUID();
}

const AVATAR_COLORS = ['#FF6B00', '#22C55E', '#F59E0B', '#EF4444', '#A1A1AA'];

export async function signup(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = storage.getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  const passwordHash = await hashPassword(password);
  const user: LocalUser = {
    id: genId(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };
  storage.saveUsers([...users, user]);
  storage.saveSession({ userId: user.id, name: user.name, email: user.email });
  return { success: true };
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = storage.getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) return { success: false, error: 'No account found with this email.' };
  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) return { success: false, error: 'Incorrect password.' };
  storage.saveSession({ userId: user.id, name: user.name, email: user.email });
  return { success: true };
}

export function loginWithGoogleProfile(name: string, email: string): void {
  const users = storage.getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  let user = users.find((u) => u.email === normalizedEmail);
  if (!user) {
    user = {
      id: genId(),
      name,
      email: normalizedEmail,
      passwordHash: '',
      createdAt: new Date().toISOString(),
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };
    storage.saveUsers([...users, user]);
  }
  storage.saveSession({ userId: user.id, name: user.name, email: user.email });
}

export function logout(): void {
  storage.saveSession(null);
}

export function getCurrentUser(): LocalUser | null {
  const session = storage.getSession();
  if (!session) return null;
  return storage.getUsers().find((u) => u.id === session.userId) ?? null;
}

export function isAuthenticated(): boolean {
  return storage.getSession() !== null;
}

export function updateProfile(patch: { name?: string; email?: string }): void {
  const session = storage.getSession();
  if (!session) return;
  const users = storage.getUsers().map((u) =>
    u.id === session.userId ? { ...u, ...patch, email: (patch.email ?? u.email).toLowerCase() } : u
  );
  storage.saveUsers(users);
  storage.saveSession({
    userId: session.userId,
    name: patch.name ?? session.name,
    email: (patch.email ?? session.email).toLowerCase(),
  });
}
