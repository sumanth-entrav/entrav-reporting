"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthPoint } from "@/lib/types";
import { fmtMonth, fmtMonthShort, fmtZAR, fmtZARCompact } from "@/lib/format";
import { SERIES } from "@/lib/brand";
import { ChartTooltip } from "./ChartTooltip";

export function TrendChart({ data, height = 300 }: { data: MonthPoint[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
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
        <Bar dataKey="amount" name="Gross spend" fill={SERIES.amber} radius={[4, 4, 0, 0]} maxBarSize={38} />
        <Line
          dataKey="netFare"
          name="Net fare"
          type="monotone"
          stroke={SERIES.navy}
          strokeWidth={2.5}
          dot={{ r: 2.5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
