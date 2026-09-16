// Formatting helpers, aligned with the main eNtrav app (ZAR, en-ZA).

/** Full rand amount, rounded to the nearest rand: R28,552,689 */
export function fmtZAR(n: number): string {
  return "R" + Math.round(n).toLocaleString("en-ZA");
}

/** Compact rand for axis ticks / KPIs: R28.6m, R512k, R940 */
export function fmtZARCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return "R" + (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  if (abs >= 1_000) return "R" + Math.round(n / 1_000) + "k";
  return "R" + Math.round(n);
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-ZA");
}

export function fmtPct(n: number, digits = 1): string {
  return n.toFixed(digits) + "%";
}

/** "2024-03" -> "Mar 2024" */
export function fmtMonth(iso: string): string {
  if (!iso) return "—";
  const [y, m] = iso.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Number(m) - 1;
  return `${names[idx] ?? m} ${y}`;
}

/** "2024-03" -> "Mar '24" (compact, for dense axes) */
export function fmtMonthShort(iso: string): string {
  if (!iso) return "—";
  const [y, m] = iso.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Number(m) - 1;
  return `${names[idx] ?? m} '${y.slice(2)}`;
}
