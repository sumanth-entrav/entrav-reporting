# eNtrav Reporting — Travel Spend Dashboard

A web-based reporting dashboard for corporate travel spend, built as a companion to
the [eNtrav](https://github.com/sumanth-entrav/entrav) travel-management platform.
It reports on a real travel-management invoice extract (the *master report*) —
**R14.9m of gross spend across 5,378 invoice lines, Mar 2024 – Jul 2025**, covering
four billing entities.

Built with **Next.js 16 (App Router, React 19, TypeScript)**, **Tailwind CSS v4**
(the eNtrav amber/navy brand theme) and **Recharts**, and deployable on **Vercel**.

---

## Pages

| Page | What it shows |
| --- | --- |
| **Overview** (`/`) | Headline KPIs (gross spend, net fare, taxes, invoices, travellers, avg/invoice), monthly spend trend, product-category split, top suppliers and spend by client. |
| **Revenue & Fees** (`/revenue`) | Gross vs. net vs. taxes, agency **fee income** split out from travel spend, monthly spend stacked by category, and a full category breakdown table. |
| **Suppliers** (`/suppliers`) | Supplier-type mix (air / land / fees), product-category split, top-12 suppliers chart and a detailed top-20 supplier table. |
| **Cost Centres** (`/cost-centres`) | Spend by reason for travel, top-30 cost centres, and a normalised reason-for-travel table. |
| **Clients** (`/clients`) | Spend share by billing entity, a per-client summary (top category & supplier), and monthly spend stacked by client. |

---

## Data

The dashboard is **standalone** — it ships with a cleaned dataset baked in
(`lib/data/spend.json`), so it renders with no database or API. Aggregation happens
server-side in `lib/metrics.ts`; only summarised results reach the client charts.

The dataset is produced from the source CSV by `scripts/prepare-data.py`:

```bash
python3 scripts/prepare-data.py /path/to/master_report_file.csv
```

This writes `lib/data/spend.json` and `lib/data/meta.json`. The prep step:

- **Omits individual passenger names.** Only an anonymous distinct-traveller *count*
  is kept (`meta.json`), so no personal names are committed to this repository.
- **Drops trailing export "total" rows** (lines with no invoice number and no invoice
  date) — the source contained one such row of ~R13.6m that would otherwise double
  the apparent spend.
- Normalises amounts, dates (`dd/mm/yyyy` → ISO), client / category / supplier codes,
  and collapses the free-text *reason for travel* values.

> The source CSV itself is **not** committed. Regenerate the dataset from your own
> extract with the command above.

### Fields (`lib/data/spend.json`)

`client`, `invDate`, `month`, `invNo`, `amount` (gross), `airportTax`, `netFare`,
`vat`, `category` (product / commission type), `tvlDate`, `reason`, `costCentre`,
`supTyp` (Air / Land / N/A), `supplier`.

---

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Deploying to Vercel

The app is a standard Next.js App Router project with no runtime environment
variables — connect the repository to Vercel and it builds and deploys as-is.

---

## Project structure

```
app/
  layout.tsx            top-nav shell + brand theme
  page.tsx              Overview
  revenue/              Revenue & Fees
  suppliers/            Suppliers
  cost-centres/         Cost Centres & travel reasons
  clients/              Clients
components/
  TopNav, Kpi, Card, DataTable, PageHeader, Logo
  charts/               Recharts client components (Trend, RankBar, Donut, StackedTrend, Tooltip)
lib/
  metrics.ts            server-side aggregation over the dataset
  format.ts             ZAR / date / month formatting (en-ZA)
  brand.ts              chart palette (amber/navy brand)
  categories.ts         product vs. agency-fee category grouping
  types.ts              dataset & chart types
  data/                 spend.json (baked-in dataset) + meta.json
scripts/
  prepare-data.py       CSV → dataset (privacy-preserving)
```
