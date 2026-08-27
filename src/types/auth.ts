export interface LocalUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  avatarColor: string;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
}
