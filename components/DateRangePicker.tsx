"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DATA_MAX, DATA_MIN } from "@/lib/range";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Build the list of months spanned by the dataset (inclusive).
function monthOptions(): { value: string; label: string }[] {
  const [minY, minM] = DATA_MIN.split("-").map(Number);
  const [maxY, maxM] = DATA_MAX.split("-").map(Number);
  const out: { value: string; label: string }[] = [];
  let y = minY;
  let m = minM;
  while (y < maxY || (y === maxY && m <= maxM)) {
    const mm = String(m).padStart(2, "0");
    out.push({ value: `${y}-${mm}`, label: `${MONTH_NAMES[m - 1]} ${y}` });
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

const MONTHS = monthOptions();

/** Last day of a "YYYY-MM" month as an ISO date. */
function monthEnd(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const day = new Date(y, m, 0).getDate();
  return `${month}-${String(day).padStart(2, "0")}`;
}

/** If from/to exactly span a single calendar month, return that "YYYY-MM". */
function activeMonth(from: string, to: string): string {
  if (!from || !to) return "";
  const month = from.slice(0, 7);
  if (from === `${month}-01` && to === monthEnd(month)) return month;
  return "";
}

export function DateRangePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const from = sp.get("from") ?? "";
  const to = sp.get("to") ?? "";
  const selectedMonth = activeMonth(from, to);
  const hasRange = Boolean(from || to);

  function apply(nextFrom: string, nextTo: string) {
    const params = new URLSearchParams(sp.toString());
    if (nextFrom) params.set("from", nextFrom);
    else params.delete("from");
    if (nextTo) params.set("to", nextTo);
    else params.delete("to");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const inputCls =
    "rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex items-center gap-2">
        <label htmlFor="month" className="text-xs font-semibold text-[var(--color-text-muted)]">
          Month
        </label>
        <select
          id="month"
          className={inputCls}
          value={selectedMonth}
          onChange={(e) => {
            const mth = e.target.value;
            if (!mth) apply("", "");
            else apply(`${mth}-01`, monthEnd(mth));
          }}
        >
          <option value="">All months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="from" className="text-xs font-semibold text-[var(--color-text-muted)]">
          From
        </label>
        <input
          id="from"
          type="date"
          className={inputCls}
          min={DATA_MIN}
          max={DATA_MAX}
          value={from}
          onChange={(e) => apply(e.target.value, to)}
        />
        <label htmlFor="to" className="text-xs font-semibold text-[var(--color-text-muted)]">
          To
        </label>
        <input
          id="to"
          type="date"
          className={inputCls}
          min={DATA_MIN}
          max={DATA_MAX}
          value={to}
          onChange={(e) => apply(from, e.target.value)}
        />
      </div>

      {hasRange && (
        <button
          type="button"
          onClick={() => apply("", "")}
          className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-paper)]"
        >
          Clear
        </button>
      )}
    </div>
  );
}
