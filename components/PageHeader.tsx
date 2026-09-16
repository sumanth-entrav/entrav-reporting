export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-[var(--color-ink)]">{title}</h1>
      {subtitle && <p className="text-sm text-[var(--color-text-muted)] mt-1">{subtitle}</p>}
    </div>
  );
}
