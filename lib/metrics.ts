import raw from "./data/spend.json";
import meta from "./data/meta.json";
import type { Datum, MonthPoint, SpendRecord } from "./types";

const RECORDS = raw as SpendRecord[];
// Aggregate metadata generated alongside the dataset. `travellers` is a
// distinct count only — individual passenger names are never stored.
const META = meta as { travellers: number };

export function dataset(): SpendRecord[] {
  return RECORDS;
}

export type Totals = {
  gross: number;
  net: number;
  tax: number;
  records: number;
  invoices: number;
  passengers: number;
  suppliers: number;
  costCentres: number;
  clients: number;
  months: number;
  avgPerTxn: number;
  avgPerInvoice: number;
  firstMonth: string;
  lastMonth: string;
};

function distinct(sel: (r: SpendRecord) => string): number {
  const s = new Set<string>();
  for (const r of RECORDS) {
    const v = sel(r);
    if (v) s.add(v);
  }
  return s.size;
}

export function totals(records: SpendRecord[] = RECORDS): Totals {
  let gross = 0;
  let net = 0;
  let tax = 0;
  const invoices = new Set<string>();
  const suppliers = new Set<string>();
  const costCentres = new Set<string>();
  const clients = new Set<string>();
  const months = new Set<string>();
  for (const r of records) {
    gross += r.amount;
    net += r.netFare;
    tax += r.airportTax;
    if (r.invNo) invoices.add(r.invNo);
    if (r.supplier) suppliers.add(r.supplier);
    if (r.costCentre) costCentres.add(r.costCentre);
    if (r.client) clients.add(r.client);
    if (r.month) months.add(r.month);
  }
  const sortedMonths = [...months].sort();
  return {
    gross,
    net,
    tax,
    records: records.length,
    invoices: invoices.size,
    passengers: META.travellers,
    suppliers: suppliers.size,
    costCentres: costCentres.size,
    clients: clients.size,
    months: months.size,
    avgPerTxn: records.length ? gross / records.length : 0,
    avgPerInvoice: invoices.size ? gross / invoices.size : 0,
    firstMonth: sortedMonths[0] ?? "",
    lastMonth: sortedMonths[sortedMonths.length - 1] ?? "",
  };
}

/** Sum a value by a grouping key, returned as Datum[] sorted by value desc.
 *  `value` is summed amount; `extra` is the transaction count in that group. */
export function groupAgg(
  key: (r: SpendRecord) => string,
  records: SpendRecord[] = RECORDS,
  value: (r: SpendRecord) => number = (r) => r.amount
): Datum[] {
  const sums = new Map<string, number>();
  const counts = new Map<string, number>();
  for (const r of records) {
    const k = key(r) || "—";
    sums.set(k, (sums.get(k) ?? 0) + value(r));
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...sums.entries()]
    .map(([label, v]) => ({ label, value: v, extra: counts.get(label) ?? 0 }))
    .sort((a, b) => b.value - a.value);
}

/** Collapse everything past the top `n` into a single "Other" bucket. */
export function topN(data: Datum[], n: number, otherLabel = "Other"): Datum[] {
  if (data.length <= n) return data;
  const head = data.slice(0, n);
  const tail = data.slice(n);
  const other = tail.reduce(
    (acc, d) => ({ value: acc.value + d.value, extra: (acc.extra ?? 0) + (d.extra ?? 0) }),
    { value: 0, extra: 0 }
  );
  return [...head, { label: otherLabel, value: other.value, extra: other.extra }];
}

/** Monthly spend series (blank/undated rows excluded), chronologically ordered. */
export function byMonth(records: SpendRecord[] = RECORDS): MonthPoint[] {
  const map = new Map<string, MonthPoint>();
  for (const r of records) {
    if (!r.month) continue;
    const p = map.get(r.month) ?? { month: r.month, amount: 0, netFare: 0, tax: 0, count: 0 };
    p.amount += r.amount;
    p.netFare += r.netFare;
    p.tax += r.airportTax;
    p.count += 1;
    map.set(r.month, p);
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

// Convenience grouped views used across pages.
export const byCategory = (rs?: SpendRecord[]) => groupAgg((r) => r.category, rs);
export const bySupplier = (rs?: SpendRecord[]) => groupAgg((r) => r.supplier, rs);
export const byClient = (rs?: SpendRecord[]) => groupAgg((r) => r.client, rs);
export const byCostCentre = (rs?: SpendRecord[]) => groupAgg((r) => r.costCentre, rs);
export const byReason = (rs?: SpendRecord[]) => groupAgg((r) => r.reason, rs);
export const bySupTyp = (rs?: SpendRecord[]) => groupAgg((r) => r.supTyp, rs);

export { distinct };
