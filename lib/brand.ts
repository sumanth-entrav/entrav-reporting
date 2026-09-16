// Chart palette derived from the eNtrav amber/navy brand. Ordered so the two
// brand colours (navy, amber) lead, followed by accessible, distinct hues.
export const SERIES = {
  amber: "#d98e2b",
  amberDark: "#b3701a",
  navy: "#16223a",
  green: "#2f7d51",
  blue: "#3b6ea5",
  red: "#b3403a",
  purple: "#7d5ba6",
  slate: "#4f7a8c",
  olive: "#8a9a5b",
  muted: "#5b6472",
} as const;

// Categorical palette for multi-series / share charts.
export const CATEGORICAL: string[] = [
  SERIES.navy,
  SERIES.amber,
  SERIES.green,
  SERIES.blue,
  SERIES.purple,
  SERIES.slate,
  SERIES.red,
  SERIES.olive,
  SERIES.amberDark,
  SERIES.muted,
];

export function colorAt(i: number): string {
  return CATEGORICAL[i % CATEGORICAL.length];
}
