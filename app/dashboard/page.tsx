import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatTanggalWaktu, labelStatusKlaim } from "@/lib/format";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: barangTersimpan },
    { count: klaimMenunggu },
    { count: sudahDikembalikan },
    { data: klaimTerbaru },
  ] = await Promise.all([
    supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("status", "TERSIMPAN"),
    supabase
      .from("claims")
      .select("*", { count: "exact", head: true })
      .eq("status", "MENUNGGU"),
    supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("status", "DIKEMBALIKAN"),
    supabase
      .from("claims")
      .select("id, nama_pengklaim, status, created_at, items(nama_barang)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Ringkasan barang tertinggal & klaim.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Barang Tersimpan" value={barangTersimpan ?? 0} />
        <StatCard label="Klaim Menunggu" value={klaimMenunggu ?? 0} />
        <StatCard label="Sudah Dikembalikan" value={sudahDikembalikan ?? 0} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Klaim Terbaru</h2>
          <Link
            href="/dashboard/klaim"
            className="text-sm text-blue-700 hover:underline dark:text-blue-400"
          >
            Lihat semua
          </Link>
        </div>

        {!klaimTerbaru || klaimTerbaru.length === 0 ? (
          <p className="rounded-md border border-black/10 p-6 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
            Belum ada pengajuan klaim.
          </p>
        ) : (
          <div className="divide-y divide-black/10 rounded-md border border-black/10 dark:divide-white/10 dark:border-white/10">
            {klaimTerbaru.map((klaim) => {
              const namaBarang = Array.isArray(klaim.items)
                ? klaim.items[0]?.nama_barang
                : (klaim.items as { nama_barang: string } | null)
                    ?.nama_barang;

              return (
                <Link
                  key={klaim.id}
                  href={`/dashboard/klaim/${klaim.id}`}
                  className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div>
                    <p className="font-medium">{namaBarang ?? "-"}</p>
                    <p className="text-black/60 dark:text-white/60">
                      {klaim.nama_pengklaim} ·{" "}
                      {formatTanggalWaktu(klaim.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium dark:bg-white/10">
                    {labelStatusKlaim(klaim.status)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
      <p className="text-sm text-black/60 dark:text-white/60">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
