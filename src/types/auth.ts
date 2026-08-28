export type UserRole = 'user' | 'admin';

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  avatarColor: string;
  role: UserRole;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
}
