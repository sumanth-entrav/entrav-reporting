"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Datum } from "@/lib/types";
import { fmtZAR, fmtZARCompact } from "@/lib/format";
import { colorAt, SERIES } from "@/lib/brand";
import { ChartTooltip } from "./ChartTooltip";

/** Horizontal ranked bars (top-N). Set `multicolor` to tint each bar. */
export function RankBarChart({
  data,
  height,
  multicolor = false,
  color = SERIES.amber,
}: {
  data: Datum[];
  height?: number;
  multicolor?: boolean;
  color?: string;
}) {
  const h = height ?? Math.max(140, data.length * 34 + 20);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 56, bottom: 4, left: 8 }}
        barCategoryGap={6}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={168}
          tick={{ fontSize: 11, fill: "var(--color-text)" }}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <Tooltip content={<ChartTooltip format={fmtZAR} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        <Bar dataKey="value" name="Spend" radius={[0, 4, 4, 0]} maxBarSize={26}>
          {data.map((_, i) => (
            <Cell key={i} fill={multicolor ? colorAt(i) : color} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v: React.ReactNode) => fmtZARCompact(Number(v))}
            style={{ fontSize: 11, fill: "var(--color-text-muted)", fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
