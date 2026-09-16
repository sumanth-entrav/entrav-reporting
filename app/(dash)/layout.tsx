import { Suspense } from "react";
import { TopNav } from "@/components/TopNav";
import { DateRangePicker } from "@/components/DateRangePicker";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-2.5">
          <Suspense fallback={<div className="h-9" />}>
            <DateRangePicker />
          </Suspense>
        </div>
      </div>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
