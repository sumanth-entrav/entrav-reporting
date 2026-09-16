import { Card } from "@/components/Card";
import { Kpi } from "@/components/Kpi";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { DonutChart } from "@/components/charts/DonutChart";
import { StackedTrend, type StackRow, type StackSeries } from "@/components/charts/StackedTrend";
import { byClient, dataset, groupAgg, totals } from "@/lib/metrics";
import { colorAt } from "@/lib/brand";
import { fmtInt, fmtZAR, fmtZARCompact } from "@/lib/format";

type ClientRow = {
  client: string;
  gross: number;
  lines: number;
  topCategory: string;
  topSupplier: string;
};

export default function ClientsPage() {
  const t = totals();
  const rows = dataset();
  const clients = byClient();

  // Per-client summary.
  const summaries: ClientRow[] = clients.map((c) => {
    const sub = rows.filter((r) => r.client === c.label);
    const topCategory = groupAgg((r) => r.category, sub)[0]?.label ?? "—";
    const topSupplier = groupAgg((r) => r.supplier, sub)[0]?.label ?? "—";
    return { client: c.label, gross: c.value, lines: c.extra ?? 0, topCategory, topSupplier };
  });

  // Monthly spend stacked by client.
  const series: StackSeries[] = clients.map((c, i) => ({ key: c.label, label: c.label, color: colorAt(i) }));
  const monthMap = new Map<string, StackRow>();
  for (const r of rows) {
    if (!r.month) continue;
    let row = monthMap.get(r.month);
    if (!row) {
      row = { month: r.month } as StackRow;
      for (const s of series) row[s.key] = 0;
      monthMap.set(r.month, row);
    }
    row[r.client] = ((row[r.client] as number) ?? 0) + r.amount;
  }
  const stackData = [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));

  const cols: Column<ClientRow>[] = [
    { header: "Client", cell: (d) => <span className="font-medium">{d.client}</span> },
    { header: "Lines", align: "right", cell: (d) => fmtInt(d.lines) },
    { header: "Top category", cell: (d) => d.topCategory },
    { header: "Top supplier", cell: (d) => d.topSupplier },
    { header: "Gross spend", align: "right", cell: (d) => fmtZAR(d.gross) },
    { header: "% of total", align: "right", cell: (d) => ((d.gross / t.gross) * 100).toFixed(1) + "%" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-6 space-y-6">
      <PageHeader title="Clients" subtitle={`Spend across ${fmtInt(t.clients)} billing entities`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Clients" value={fmtInt(t.clients)} />
        <Kpi label="Largest client" value={clients[0]?.label ?? "—"} sub={fmtZAR(clients[0]?.value ?? 0)} accent />
        <Kpi
          label="Largest client share"
          value={(((clients[0]?.value ?? 0) / t.gross) * 100).toFixed(0) + "%"}
          sub="of gross spend"
        />
        <Kpi label="Gross spend" value={fmtZARCompact(t.gross)} sub={fmtZAR(t.gross)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Spend by client" subtitle="Share of total gross spend">
          <DonutChart data={clients} />
        </Card>
        <Card title="Client summary" subtitle="Volume and top spend drivers">
          <DataTable columns={cols} rows={summaries} keyOf={(d) => d.client} />
        </Card>
      </div>

      <Card title="Monthly spend by client" subtitle="Stacked gross spend per month">
        <StackedTrend data={stackData} series={series} />
      </Card>
    </div>
  );
}
