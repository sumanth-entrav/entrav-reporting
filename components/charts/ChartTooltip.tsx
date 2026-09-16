"use client";

import type { ReactNode } from "react";

type Entry = {
  name?: ReactNode;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
};

/** Shared, brand-styled tooltip. `format` renders each numeric value. */
export function ChartTooltip({
  active,
  payload,
  label,
  format,
  labelFormat,
}: {
  active?: boolean;
  payload?: Entry[];
  label?: string | number;
  format?: (v: number) => string;
  labelFormat?: (v: string | number) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const fmt = format ?? ((v: number) => String(v));
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 shadow-md text-xs">
      {label != null && (
        <div className="font-semibold text-[var(--color-ink)] mb-1">
          {labelFormat ? labelFormat(label) : label}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {payload.map((e, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: e.color }} />
              {e.name}
            </span>
            <span className="font-semibold tabular-nums text-[var(--color-ink)]">
              {typeof e.value === "number" ? fmt(e.value) : e.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
