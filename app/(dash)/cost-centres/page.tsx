import { Card } from "@/components/Card";
import { Kpi } from "@/components/Kpi";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { RankBarChart } from "@/components/charts/RankBarChart";
import { byCostCentre, byReason, topN, totals } from "@/lib/metrics";
import { fmtInt, fmtZAR, fmtZARCompact } from "@/lib/format";
import type { Datum } from "@/lib/types";

export default function CostCentresPage() {
  const t = totals();
  const costCentres = byCostCentre();
  const reasons = topN(byReason(), 10, "Other reasons");

  const ccCols: Column<Datum>[] = [
    { header: "#", align: "right", cell: (_, i) => i + 1, width: "40px" },
    { header: "Cost centre", cell: (d) => <span className="font-mono text-xs">{d.label}</span> },
    { header: "Lines", align: "right", cell: (d) => fmtInt(d.extra ?? 0) },
    { header: "Spend", align: "right", cell: (d) => fmtZAR(d.value) },
    { header: "% of gross", align: "right", cell: (d) => ((d.value / t.gross) * 100).toFixed(1) + "%" },
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
        subtitle={`${fmtInt(t.costCentres)} cost centres · ${fmtInt(t.passengers)} travellers`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Cost centres" value={fmtInt(t.costCentres)} />
        <Kpi label="Top cost centre" value={fmtZARCompact(costCentres[0]?.value ?? 0)} sub="highest spend" accent />
        <Kpi label="Travellers" value={fmtInt(t.passengers)} sub="distinct (names not stored)" />
        <Kpi label="Reasons logged" value={fmtInt(byReason().length)} sub="distinct trip reasons" />
      </div>

      <Card title="Spend by reason for travel" subtitle="Top 10 reasons (normalised)">
        <RankBarChart data={reasons} multicolor />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top 30 cost centres" subtitle="By gross spend">
          <DataTable columns={ccCols} rows={costCentres.slice(0, 30)} keyOf={(d) => d.label} />
        </Card>
        <Card title="Reason for travel" subtitle="All normalised reasons by gross spend">
          <DataTable columns={reasonCols} rows={byReason().slice(0, 30)} keyOf={(d) => d.label} />
        </Card>
      </div>
    </div>
  );
}
