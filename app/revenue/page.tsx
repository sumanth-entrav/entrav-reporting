import { Card } from "@/components/Card";
import { Kpi } from "@/components/Kpi";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { TrendChart } from "@/components/charts/TrendChart";
import { StackedTrend, type StackRow, type StackSeries } from "@/components/charts/StackedTrend";
import { byCategory, byMonth, dataset, totals } from "@/lib/metrics";
import { isFeeCategory } from "@/lib/categories";
import { colorAt } from "@/lib/brand";
import { fmtInt, fmtPct, fmtZAR, fmtZARCompact } from "@/lib/format";
import type { Datum } from "@/lib/types";

export default function RevenuePage() {
  const t = totals();
  const months = byMonth();
  const categories = byCategory();

  const feeIncome = categories.filter((c) => isFeeCategory(c.label)).reduce((a, c) => a + c.value, 0);
  const travelSpend = t.gross - feeIncome;

  // Top categories become individual stacked series; the rest fold into "Other".
  const TOP = 6;
  const topCats = categories.slice(0, TOP).map((c) => c.label);
  const series: StackSeries[] = [
    ...topCats.map((label, i) => ({ key: label, label, color: colorAt(i) })),
    { key: "Other categories", label: "Other categories", color: colorAt(TOP) },
  ];
  const rows = dataset();
  const monthMap = new Map<string, StackRow>();
  for (const r of rows) {
    if (!r.month) continue;
    let row = monthMap.get(r.month);
    if (!row) {
      row = { month: r.month } as StackRow;
      for (const s of series) row[s.key] = 0;
      monthMap.set(r.month, row);
    }
    const key = topCats.includes(r.category) ? r.category : "Other categories";
    row[key] = (row[key] as number) + r.amount;
  }
  const stackData = [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));

  const cols: Column<Datum>[] = [
    { header: "Category", cell: (d) => <span className="font-medium">{d.label}</span> },
    { header: "Lines", align: "right", cell: (d) => fmtInt(d.extra ?? 0) },
    { header: "Spend", align: "right", cell: (d) => fmtZAR(d.value) },
    { header: "% of gross", align: "right", cell: (d) => fmtPct((d.value / t.gross) * 100) },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-6 space-y-6">
      <PageHeader title="Revenue & Fees" subtitle="Gross spend, net fare, taxes and agency fee income" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <Kpi label="Gross spend" value={fmtZARCompact(t.gross)} sub={fmtZAR(t.gross)} accent />
        <Kpi label="Travel spend" value={fmtZARCompact(travelSpend)} sub="excl. agency fees" />
        <Kpi label="Fee income" value={fmtZARCompact(feeIncome)} sub={`${fmtPct((feeIncome / t.gross) * 100)} of gross`} />
        <Kpi label="Net fare" value={fmtZARCompact(t.net)} sub={fmtZAR(t.net)} />
        <Kpi label="Airport taxes" value={fmtZARCompact(t.tax)} sub={fmtZAR(t.tax)} />
      </div>

      <Card title="Monthly spend" subtitle="Gross invoice amount with net fare overlaid">
        <TrendChart data={months} />
      </Card>

      <Card title="Monthly spend by category" subtitle={`Top ${TOP} categories, remainder grouped as "Other"`}>
        <StackedTrend data={stackData} series={series} />
      </Card>

      <Card title="Category breakdown" subtitle="All product & fee categories by gross spend">
        <DataTable columns={cols} rows={categories} keyOf={(d) => d.label} />
      </Card>
    </div>
  );
}
