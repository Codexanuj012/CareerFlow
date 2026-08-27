export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-primary" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  );
}
