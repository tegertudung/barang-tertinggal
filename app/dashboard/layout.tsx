import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/DashboardNav";

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
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <aside className="border-b border-black/10 p-4 md:w-56 md:shrink-0 md:border-b-0 md:border-r dark:border-white/10">
        <Link href="/dashboard" className="mb-1 block">
          <span className="block text-sm font-semibold tracking-wide text-blue-700 dark:text-blue-400">
            BARANG TERTINGGAL
          </span>
          <span className="block text-xs text-black/60 dark:text-white/60">
            Panel Petugas
          </span>
        </Link>
        <p className="mb-4 truncate text-xs text-black/50 dark:text-white/50">
          {nama}
        </p>
        <DashboardNav />
      </aside>

      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
