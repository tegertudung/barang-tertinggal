"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import {
  IconBarChart,
  IconBox,
  IconDashboard,
  IconLogout,
  IconMail,
  IconRefresh,
  IconUser,
} from "@/components/icons";

const MENU = [
  { href: "/dashboard", label: "Dashboard", exact: true, icon: IconDashboard },
  { href: "/dashboard/barang", label: "Data Barang", icon: IconBox },
  { href: "/dashboard/klaim", label: "Klaim Barang", icon: IconMail },
  { href: "/dashboard/pengembalian", label: "Pengembalian", icon: IconRefresh },
  { href: "/dashboard/laporan", label: "Laporan", icon: IconBarChart },
  { href: "/dashboard/profil", label: "Profil Petugas", icon: IconUser },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {MENU.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-white/15 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </Link>
        );
      })}

      <form action={logout} className="mt-4 border-t border-white/10 pt-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
        >
          <IconLogout className="h-[18px] w-[18px] shrink-0" />
          Keluar Sistem
        </button>
      </form>
    </nav>
  );
}
