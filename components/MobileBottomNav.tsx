"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBarChart,
  IconBox,
  IconDashboard,
  IconMail,
  IconRefresh,
} from "@/components/icons";

const MENU = [
  { href: "/dashboard", label: "Dashboard", exact: true, icon: IconDashboard },
  { href: "/dashboard/barang", label: "Data Barang", icon: IconBox },
  { href: "/dashboard/klaim", label: "Klaim Barang", icon: IconMail },
  { href: "/dashboard/pengembalian", label: "Pengembalian", icon: IconRefresh },
  { href: "/dashboard/laporan", label: "Laporan", icon: IconBarChart },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      {MENU.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium ${
              active
                ? "text-brand-primary"
                : "text-black/50"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
