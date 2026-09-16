// Shape of one cleaned travel-spend invoice line, as stored in
// lib/data/spend.json (generated from the master report CSV).
export type SpendRecord = {
  client: string;
  invDate: string; // ISO yyyy-mm-dd (invoice date)
  month: string; // yyyy-mm derived from invDate
  invNo: string;
  amount: number; // gross invoice amount (ZAR)
  airportTax: number;
  netFare: number;
  vat: string; // e.g. "15.00%"
  category: string; // product / commission type, e.g. "Domestic Air Travel"
  tvlDate: string; // ISO yyyy-mm-dd (travel date)
  reason: string; // reason for travel (normalised)
  costCentre: string;
  supTyp: string; // Air / Land / N/A
  supplier: string;
};

/** A generic {label, value} pair used to feed rank/pie charts. */
export type Datum = { label: string; value: number; extra?: number };

/** One month of aggregated spend, used by the trend chart. */
export type MonthPoint = {
  month: string; // yyyy-mm
  amount: number; // gross invoice amount
  netFare: number;
  tax: number;
  count: number; // number of transactions
};
