import type { ReactNode } from "react";

export type Column<T> = {
  header: string;
  cell: (row: T, index: number) => ReactNode;
  align?: "left" | "right";
  width?: string;
};

export function DataTable<T>({
  columns,
  rows,
  keyOf,
}: {
  columns: Column<T>[];
  rows: T[];
  keyOf: (row: T, index: number) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="rtable">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} className={c.align === "right" ? "num" : ""} style={c.width ? { width: c.width } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={keyOf(row, ri)}>
              {columns.map((c, ci) => (
                <td key={ci} className={c.align === "right" ? "num" : ""}>
                  {c.cell(row, ri)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
