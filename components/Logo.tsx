export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 font-semibold ${className}`}>
      <span className="text-lg tracking-tight">
        e<span className="text-[var(--color-accent)]">N</span>trav
      </span>
      <span className="text-[0.65rem] font-medium uppercase tracking-widest opacity-70">
        Reporting
      </span>
    </span>
  );
}
