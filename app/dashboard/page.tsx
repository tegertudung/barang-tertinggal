import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { daysAgoIso, daysSince, formatTanggal } from "@/lib/format";
import { formatNomorKlaim } from "@/types/database";
import { KlaimStatusBadge } from "@/components/StatusBadge";
import { IconBox, IconClock, IconMail, IconRefresh, IconTrendUp } from "@/components/icons";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const tigaPuluhHariLalu = daysAgoIso(30);

  const [
    { count: barangTersimpan },
    { count: barangBaruBulanIni },
    { count: klaimMenunggu },
    { count: sudahDikembalikan },
    { count: pengembalianBulanIni },
    { data: klaimTerbaru },
    { data: perluTindakLanjut },
  ] = await Promise.all([
    supabase.from("items").select("*", { count: "exact", head: true }).eq("status", "TERSIMPAN"),
    supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("status", "TERSIMPAN")
      .gte("created_at", tigaPuluhHariLalu),
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("status", "MENUNGGU"),
    supabase.from("items").select("*", { count: "exact", head: true }).eq("status", "DIKEMBALIKAN"),
    supabase
      .from("returns")
      .select("*", { count: "exact", head: true })
      .gte("tanggal_pengembalian", tigaPuluhHariLalu),
    supabase
      .from("claims")
      .select("id, nama_pengklaim, status, nomor_urut, created_at, items(nama_barang)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("claims")
      .select("id, nama_pengklaim, created_at, items(nama_barang)")
      .eq("status", "MENUNGGU")
      .order("created_at", { ascending: true })
      .limit(5),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<IconBox className="h-5 w-5" />}
          iconClass="bg-green-50 text-green-700"
          value={barangTersimpan ?? 0}
          label="Barang Tersimpan"
          trend={
            barangBaruBulanIni
              ? `+${barangBaruBulanIni} barang bulan ini`
              : undefined
          }
        />
        <StatCard
          icon={<IconMail className="h-5 w-5" />}
          iconClass="bg-amber-100 text-amber-700"
          value={klaimMenunggu ?? 0}
          label="Klaim Menunggu"
          highlight
          badge={klaimMenunggu ? "Perlu tindak" : undefined}
        />
        <StatCard
          icon={<IconRefresh className="h-5 w-5" />}
          iconClass="bg-slate-100 text-slate-600"
          value={sudahDikembalikan ?? 0}
          label="Sudah Dikembalikan"
          trend={
            pengembalianBulanIni
              ? `+${pengembalianBulanIni} bulan ini`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-black/10 p-4">
            <h2 className="font-semibold">Klaim Terbaru</h2>
            <Link
              href="/dashboard/klaim"
              className="text-sm text-brand-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {!klaimTerbaru || klaimTerbaru.length === 0 ? (
            <p className="p-6 text-center text-sm text-black/60">
              Belum ada pengajuan klaim.
            </p>
          ) : (
            <div className="divide-y divide-black/10">
              {klaimTerbaru.map((klaim) => {
                const namaBarang = Array.isArray(klaim.items)
                  ? klaim.items[0]?.nama_barang
                  : (klaim.items as { nama_barang: string } | null)?.nama_barang;

                return (
                  <Link
                    key={klaim.id}
                    href={`/dashboard/klaim/${klaim.id}`}
                    className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-black/5"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-black/50">
                        {formatNomorKlaim(klaim)}
                      </p>
                      <p className="truncate font-medium">{namaBarang ?? "-"}</p>
                      <p className="truncate text-black/60">
                        {klaim.nama_pengklaim} · {formatTanggal(klaim.created_at)}
                      </p>
                    </div>
                    <KlaimStatusBadge status={klaim.status} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-black/10 bg-white">
          <div className="border-b border-black/10 p-4">
            <h2 className="font-semibold">Perlu Ditindaklanjuti</h2>
          </div>

          {!perluTindakLanjut || perluTindakLanjut.length === 0 ? (
            <p className="p-6 text-center text-sm text-black/60">
              Tidak ada klaim yang menunggu.
            </p>
          ) : (
            <div className="space-y-3 p-4">
              {perluTindakLanjut.map((klaim) => {
                const namaBarang = Array.isArray(klaim.items)
                  ? klaim.items[0]?.nama_barang
                  : (klaim.items as { nama_barang: string } | null)?.nama_barang;
                const hari = daysSince(klaim.created_at);

                return (
                  <Link
                    key={klaim.id}
                    href={`/dashboard/klaim/${klaim.id}`}
                    className="block rounded-lg border border-black/10 p-3 text-sm hover:bg-black/5"
                  >
                    <p className="font-medium">{namaBarang ?? "-"}</p>
                    <p className="text-black/60">
                      {klaim.nama_pengklaim}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      <IconClock className="h-3 w-3" />
                      {hari === 0 ? "Hari ini" : `${hari} hari menunggu`}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconClass,
  value,
  label,
  trend,
  highlight,
  badge,
}: {
  icon: React.ReactNode;
  iconClass: string;
  value: number;
  label: string;
  trend?: string;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-amber-200 bg-amber-50"
          : "border-black/10 bg-white"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
          {icon}
        </span>
        {badge && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            {badge}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-black/60">{label}</p>
      {trend && (
        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-primary">
          <IconTrendUp className="h-3.5 w-3.5" />
          {trend}
        </p>
      )}
    </div>
  );
}
