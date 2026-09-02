"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";

const MENU = [
  { href: "/dashboard", label: "Dashboard", exact: true },
  { href: "/dashboard/barang", label: "Data Barang" },
  { href: "/dashboard/klaim", label: "Klaim Barang" },
  { href: "/dashboard/pengembalian", label: "Pengembalian" },
  { href: "/dashboard/laporan", label: "Laporan" },
  { href: "/dashboard/profil", label: "Profil" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {MENU.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-blue-700 text-white"
                : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <form action={logout} className="mt-2 border-t border-black/10 pt-2 dark:border-white/10">
        <button
          type="submit"
          className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          Logout
        </button>
      </form>
    </nav>
  );
}
