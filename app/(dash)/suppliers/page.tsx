import { Card } from "@/components/Card";
import { Kpi } from "@/components/Kpi";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { DonutChart } from "@/components/charts/DonutChart";
import { RankBarChart } from "@/components/charts/RankBarChart";
import { bySupplier, bySupTyp, byCategory, topN, totals } from "@/lib/metrics";
import { fmtInt, fmtZAR } from "@/lib/format";
import type { Datum } from "@/lib/types";

const SUP_TYP_LABEL: Record<string, string> = {
  Air: "Air (flights)",
  Land: "Land (hotels, transfers, parking)",
  "N/A": "Fees / non-supplier",
};

export default function SuppliersPage() {
  const t = totals();
  const suppliers = bySupplier();
  const topSuppliers = topN(suppliers, 12, "Other suppliers");
  const supTyp = bySupTyp().map((d) => ({ ...d, label: SUP_TYP_LABEL[d.label] ?? d.label }));
  const categories = topN(byCategory(), 8, "Other categories");

  const topSupplier = suppliers[0];
  const tableRows = suppliers.slice(0, 20);

  const cols: Column<Datum>[] = [
    { header: "#", align: "right", cell: (_, i) => i + 1, width: "40px" },
    { header: "Supplier", cell: (d) => <span className="font-medium">{d.label}</span> },
    { header: "Lines", align: "right", cell: (d) => fmtInt(d.extra ?? 0) },
    { header: "Spend", align: "right", cell: (d) => fmtZAR(d.value) },
    { header: "% of gross", align: "right", cell: (d) => ((d.value / t.gross) * 100).toFixed(1) + "%" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-6 space-y-6">
      <PageHeader title="Suppliers" subtitle={`${fmtInt(t.suppliers)} suppliers across the booking book`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Suppliers" value={fmtInt(t.suppliers)} />
        <Kpi label="Top supplier" value={topSupplier?.label ?? "—"} sub={fmtZAR(topSupplier?.value ?? 0)} accent />
        <Kpi label="Top-10 share" value={((suppliers.slice(0, 10).reduce((a, d) => a + d.value, 0) / t.gross) * 100).toFixed(0) + "%"} sub="of gross spend" />
        <Kpi label="Product categories" value={fmtInt(byCategory().length)} />
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
    </div>
  );
}
