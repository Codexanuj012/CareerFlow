export interface VariableContext {
  firstName?: string;
  company?: string;
  role?: string;
  senderName?: string;
}

export function resolveVariables(text: string, ctx: VariableContext): string {
  return text
    .replace(/\{\{\s*firstName\s*\}\}/gi, ctx.firstName || 'there')
    .replace(/\{\{\s*company\s*\}\}/gi, ctx.company || 'your company')
    .replace(/\{\{\s*role\s*\}\}/gi, ctx.role || 'the role')
    .replace(/\{\{\s*senderName\s*\}\}/gi, ctx.senderName || '');
}
