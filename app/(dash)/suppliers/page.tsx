import { Card } from "@/components/Card";
import { Kpi } from "@/components/Kpi";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { DataTable, type Column } from "@/components/DataTable";
import { DonutChart } from "@/components/charts/DonutChart";
import { RankBarChart } from "@/components/charts/RankBarChart";
import { bySupplier, bySupTyp, byCategory, dataset, topN, totals } from "@/lib/metrics";
import { filterByRange, parseRange } from "@/lib/range";
import { fmtInt, fmtZAR } from "@/lib/format";
import type { Datum } from "@/lib/types";

const SUP_TYP_LABEL: Record<string, string> = {
  Air: "Air (flights)",
  Land: "Land (hotels, transfers, parking)",
  "N/A": "Fees / non-supplier",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function SuppliersPage({ searchParams }: Props) {
  const range = parseRange(await searchParams);
  const rows = filterByRange(dataset(), range);
  const t = totals(rows);
  const suppliers = bySupplier(rows);
  const topSuppliers = topN(suppliers, 12, "Other suppliers");
  const supTyp = bySupTyp(rows).map((d) => ({ ...d, label: SUP_TYP_LABEL[d.label] ?? d.label }));
  const categories = topN(byCategory(rows), 8, "Other categories");

  const topSupplier = suppliers[0];
  const tableRows = suppliers.slice(0, 20);
  const share = (v: number) => (t.gross ? (v / t.gross) * 100 : 0);
  const top10Share = share(suppliers.slice(0, 10).reduce((a, d) => a + d.value, 0));

  const cols: Column<Datum>[] = [
    { header: "#", align: "right", cell: (_, i) => i + 1, width: "40px" },
    { header: "Supplier", cell: (d) => <span className="font-medium">{d.label}</span> },
    { header: "Lines", align: "right", cell: (d) => fmtInt(d.extra ?? 0) },
    { header: "Spend", align: "right", cell: (d) => fmtZAR(d.value) },
    { header: "% of gross", align: "right", cell: (d) => share(d.value).toFixed(1) + "%" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-6 space-y-6">
      <PageHeader title="Suppliers" subtitle={`${fmtInt(t.suppliers)} suppliers in the selected period`} />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Suppliers" value={fmtInt(t.suppliers)} />
            <Kpi label="Top supplier" value={topSupplier?.label ?? "—"} sub={fmtZAR(topSupplier?.value ?? 0)} accent />
            <Kpi label="Top-10 share" value={top10Share.toFixed(0) + "%"} sub="of gross spend" />
            <Kpi label="Product categories" value={fmtInt(categories.length ? byCategory(rows).length : 0)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Spend by supplier type" subtitle="Air vs land vs agency fees">
              <DonutChart data={supTyp} />
            </Card>
            <Card title="Spend by product category" subtitle="Top 8 categories">
              <DonutChart data={categories} />
            </Card>
          </div>

          <Card title="Top 12 suppliers" subtitle="By gross spend">
            <RankBarChart data={topSuppliers} multicolor />
          </Card>

          <Card title="Top 20 suppliers" subtitle="Detailed breakdown">
            <DataTable columns={cols} rows={tableRows} keyOf={(d) => d.label} />
          </Card>
        </>
      )}
    </div>
  );
}
