import { Card } from "@/components/Card";
import { Kpi } from "@/components/Kpi";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { TrendChart } from "@/components/charts/TrendChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { RankBarChart } from "@/components/charts/RankBarChart";
import { byCategory, byClient, bySupplier, byMonth, dataset, topN, totals } from "@/lib/metrics";
import { filterByRange, parseRange } from "@/lib/range";
import { fmtInt, fmtMonth, fmtZAR, fmtZARCompact } from "@/lib/format";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function OverviewPage({ searchParams }: Props) {
  const range = parseRange(await searchParams);
  const rows = filterByRange(dataset(), range);
  const t = totals(rows);
  const months = byMonth(rows);
  const categories = topN(byCategory(rows), 7, "Other categories");
  const suppliers = topN(bySupplier(rows), 8, "Other suppliers");
  const clients = byClient(rows);
  const travellers = Number.isNaN(t.passengers) ? "—" : fmtInt(t.passengers);
  const netShare = t.gross ? ((t.net / t.gross) * 100).toFixed(0) : "0";

  return (
    <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-6 space-y-6">
      <PageHeader
        title="Travel Spend Overview"
        subtitle={`${fmtInt(t.records)} invoice lines · ${fmtMonth(t.firstMonth)} – ${fmtMonth(
          t.lastMonth
        )} · ${t.clients} clients`}
      />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Kpi label="Gross spend" value={fmtZARCompact(t.gross)} sub={fmtZAR(t.gross)} accent />
            <Kpi label="Net fare" value={fmtZARCompact(t.net)} sub={`${netShare}% of gross`} />
            <Kpi label="Airport taxes" value={fmtZARCompact(t.tax)} sub={fmtZAR(t.tax)} />
            <Kpi label="Invoices" value={fmtInt(t.invoices)} sub={`${fmtInt(t.records)} lines`} />
            <Kpi label="Travellers" value={travellers} sub={`${fmtInt(t.suppliers)} suppliers`} />
            <Kpi label="Avg / invoice" value={fmtZARCompact(t.avgPerInvoice)} sub={`${fmtZARCompact(t.avgPerTxn)} / line`} />
          </div>

          <Card title="Monthly spend" subtitle="Gross invoice amount with net fare overlaid">
            <TrendChart data={months} />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Spend by product category" subtitle="Share of total gross spend">
              <DonutChart data={categories} />
            </Card>
            <Card title="Top suppliers" subtitle="By gross spend">
              <RankBarChart data={suppliers} />
            </Card>
          </div>

          <Card title="Spend by client" subtitle="Gross spend per billing entity">
            <RankBarChart data={clients} multicolor />
          </Card>
        </>
      )}
    </div>
  );
}
