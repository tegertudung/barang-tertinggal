import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/DashboardNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ContohTag } from "@/components/ContohTag";

function getInitials(nama: string) {
  const parts = nama.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nama = user?.email ?? "Petugas";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nama")
      .eq("id", user.id)
      .maybeSingle<{ nama: string }>();
    if (profile?.nama) nama = profile.nama;
  }

  return (
    <div className="flex min-h-full flex-1 bg-brand-page">
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-primary p-4 md:flex">
        <Link href="/dashboard" className="mb-6 flex items-center gap-3 px-1">
          <Image
            src="/logo.jpg"
            alt="Logo Balai Yanpus DPAD DIY"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-white">
              SI-BARTING
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-wide text-white/60">
              Balai Yanpus DPAD DIY
            </span>
          </span>
        </Link>
        <DashboardNav />

        <div className="mt-auto rounded-lg bg-white/10 p-3 text-xs text-white/70">
          Pos Penjagaan
          <br />
          Lobi Utama • Pagi
          <ContohTag />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-3 md:px-6">
          <span className="hidden items-center gap-2 text-sm font-medium text-black/60 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Meja Layanan Lobi Utama • Shift Pagi (08:00–15:30)
            <ContohTag />
          </span>

          <span className="flex items-center gap-3">
            <span className="text-right leading-tight">
              <span className="block text-sm font-medium text-black/70">
                {nama}
              </span>
              <span className="block text-[11px] text-black/40">
                NIP 19880315 202101 2 004
                <ContohTag />
              </span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">
              {getInitials(nama)}
            </span>
          </span>
        </header>

        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
