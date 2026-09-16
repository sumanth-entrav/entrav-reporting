import { Card } from "@/components/Card";
import { Kpi } from "@/components/Kpi";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { DataTable, type Column } from "@/components/DataTable";
import { RankBarChart } from "@/components/charts/RankBarChart";
import { byCostCentre, byReason, dataset, topN, totals } from "@/lib/metrics";
import { filterByRange, parseRange } from "@/lib/range";
import { fmtInt, fmtZAR, fmtZARCompact } from "@/lib/format";
import type { Datum } from "@/lib/types";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CostCentresPage({ searchParams }: Props) {
  const range = parseRange(await searchParams);
  const rows = filterByRange(dataset(), range);
  const t = totals(rows);
  const costCentres = byCostCentre(rows);
  const reasons = topN(byReason(rows), 10, "Other reasons");
  const travellers = Number.isNaN(t.passengers) ? "—" : fmtInt(t.passengers);
  const share = (v: number) => (t.gross ? (v / t.gross) * 100 : 0);

  const ccCols: Column<Datum>[] = [
    { header: "#", align: "right", cell: (_, i) => i + 1, width: "40px" },
    { header: "Cost centre", cell: (d) => <span className="font-mono text-xs">{d.label}</span> },
    { header: "Lines", align: "right", cell: (d) => fmtInt(d.extra ?? 0) },
    { header: "Spend", align: "right", cell: (d) => fmtZAR(d.value) },
    { header: "% of gross", align: "right", cell: (d) => share(d.value).toFixed(1) + "%" },
  ];

  const reasonCols: Column<Datum>[] = [
    { header: "Reason for travel", cell: (d) => <span className="font-medium">{d.label}</span> },
    { header: "Lines", align: "right", cell: (d) => fmtInt(d.extra ?? 0) },
    { header: "Spend", align: "right", cell: (d) => fmtZAR(d.value) },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-6 space-y-6">
      <PageHeader
        title="Cost Centres & Travel Reasons"
        subtitle={`${fmtInt(t.costCentres)} cost centres · ${travellers} travellers`}
      />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Cost centres" value={fmtInt(t.costCentres)} />
            <Kpi label="Top cost centre" value={fmtZARCompact(costCentres[0]?.value ?? 0)} sub="highest spend" accent />
            <Kpi label="Travellers" value={travellers} sub="distinct (names not stored)" />
            <Kpi label="Reasons logged" value={fmtInt(reasons.length ? byReason(rows).length : 0)} sub="distinct trip reasons" />
          </div>

          <Card title="Spend by reason for travel" subtitle="Top 10 reasons (normalised)">
            <RankBarChart data={reasons} multicolor />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Top 30 cost centres" subtitle="By gross spend">
              <DataTable columns={ccCols} rows={costCentres.slice(0, 30)} keyOf={(d) => d.label} />
            </Card>
            <Card title="Reason for travel" subtitle="All normalised reasons by gross spend">
              <DataTable columns={reasonCols} rows={byReason(rows).slice(0, 30)} keyOf={(d) => d.label} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
