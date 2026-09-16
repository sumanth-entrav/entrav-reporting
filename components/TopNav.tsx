"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

type NavItem = { href: string; label: string; icon: string };

const NAV: NavItem[] = [
  { href: "/", label: "Overview", icon: "📊" },
  { href: "/revenue", label: "Revenue & Fees", icon: "💰" },
  { href: "/suppliers", label: "Suppliers", icon: "🏨" },
  { href: "/cost-centres", label: "Cost Centres", icon: "🏢" },
  { href: "/clients", label: "Clients", icon: "🤝" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="bg-[var(--color-ink)] text-white sticky top-0 z-20 border-b border-white/10">
      <div className="flex items-center gap-4 px-4 lg:px-6 py-2.5">
        <Link href="/" className="shrink-0 text-white">
          <Logo className="!text-white" />
        </Link>

        <nav className="flex items-center gap-1 flex-1 overflow-x-auto">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? "bg-[var(--color-accent)] text-white" : "text-white/70 hover:bg-white/10"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden lg:inline text-[0.7rem] text-white/50 whitespace-nowrap">
            Mar 2024 – Jul 2025
          </span>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
