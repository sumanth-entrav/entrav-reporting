import { Card } from "./Card";

export function EmptyState({ message }: { message?: string }) {
  return (
    <Card>
      <p className="py-10 text-center text-sm text-[var(--color-text-muted)]">
        {message ?? "No transactions fall within the selected date range."}
      </p>
    </Card>
  );
}
