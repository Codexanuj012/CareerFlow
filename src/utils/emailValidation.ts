const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function parseEmailList(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export function validateEmailList(value: string): { valid: string[]; invalid: string[] } {
  const parts = parseEmailList(value);
  const valid: string[] = [];
  const invalid: string[] = [];
  parts.forEach((p) => (isValidEmail(p) ? valid.push(p) : invalid.push(p)));
  return { valid, invalid };
}
