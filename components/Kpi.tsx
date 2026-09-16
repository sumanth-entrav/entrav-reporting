import type { ReactNode } from "react";

export function Kpi({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="card p-4 flex flex-col gap-1">
      <span className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </span>
      <span
        className={`text-2xl font-bold tabular-nums leading-tight ${
          accent ? "text-[var(--color-accent-dark)]" : "text-[var(--color-ink)]"
        }`}
      >
        {value}
      </span>
      {sub != null && <span className="text-xs text-[var(--color-text-muted)]">{sub}</span>}
    </div>
  );
}
