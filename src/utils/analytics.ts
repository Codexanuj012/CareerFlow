export function safePercent(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  const value = (numerator / denominator) * 100;
  return Number.isFinite(value) ? Math.round(value * 10) / 10 : 0;
}
