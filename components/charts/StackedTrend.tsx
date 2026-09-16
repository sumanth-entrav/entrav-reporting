"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtMonth, fmtMonthShort, fmtZAR, fmtZARCompact } from "@/lib/format";
import { ChartTooltip } from "./ChartTooltip";

export type StackSeries = { key: string; label: string; color: string };
export type StackRow = { month: string } & Record<string, number | string>;

/** Monthly spend broken into stacked category series. */
export function StackedTrend({
  data,
  series,
  height = 320,
}: {
  data: StackRow[];
  series: StackSeries[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={fmtMonthShort}
          tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--color-border)" }}
        />
        <YAxis
          tickFormatter={(v) => fmtZARCompact(Number(v))}
          tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
          tickLine={false}
          axisLine={false}
          width={54}
        />
        <Tooltip
          content={<ChartTooltip format={fmtZAR} labelFormat={(v) => fmtMonth(String(v))} />}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stackId="spend"
            fill={s.color}
            maxBarSize={38}
            radius={i === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
