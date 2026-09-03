import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/DashboardNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";

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
          <span className="text-sm font-semibold leading-tight text-white">
            Balai Perpustakaan
            <br />
            DPAD DIY
          </span>
        </Link>
        <DashboardNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-3 border-b border-black/10 bg-white px-4 py-3 md:px-6">
          <span className="text-sm font-medium text-black/70">
            {nama}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">
            {getInitials(nama)}
          </span>
        </header>

        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
