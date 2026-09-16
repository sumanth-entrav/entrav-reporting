"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Datum } from "@/lib/types";
import { fmtZAR } from "@/lib/format";
import { colorAt } from "@/lib/brand";
import { ChartTooltip } from "./ChartTooltip";

export function DonutChart({ data, height = 280 }: { data: Datum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Tooltip content={<ChartTooltip format={fmtZAR} />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          wrapperStyle={{ fontSize: 12 }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="42%"
          cy="50%"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={1.5}
          stroke="var(--color-card)"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colorAt(i)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
