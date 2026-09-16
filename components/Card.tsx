import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-4 md:p-5 ${className}`}>
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h2 className="text-sm font-semibold text-[var(--color-ink)]">{title}</h2>}
          {subtitle && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
