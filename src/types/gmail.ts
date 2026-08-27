export interface GmailProfile {
  email: string;
  connectedAt: string;
}

export interface GmailSendResult {
  success: boolean;
  messageId: string | null;
  threadId: string | null;
  error?: string;
}
