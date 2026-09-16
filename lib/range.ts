import type { SpendRecord } from "./types";

export type DateRange = { from: string; to: string } | null;

// Full extent of the dataset (ISO), used to bound the date inputs.
export const DATA_MIN = "2024-03-01";
export const DATA_MAX = "2025-07-31";

type SearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

/** Read a {from,to} range from URL search params (either bound optional). */
export function parseRange(sp: SearchParams): DateRange {
  const from = one(sp.from);
  const to = one(sp.to);
  if (!from && !to) return null;
  return { from, to };
}

/** Filter invoice lines to those whose invoice date falls within the range. */
export function filterByRange(records: SpendRecord[], range: DateRange): SpendRecord[] {
  if (!range) return records;
  const { from, to } = range;
  return records.filter((r) => {
    if (!r.invDate) return false;
    if (from && r.invDate < from) return false;
    if (to && r.invDate > to) return false;
    return true;
  });
}
