import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { daysAgoIso, formatTanggalWaktu, todayFormatted } from "@/lib/format";
import { formatNomorKlaim } from "@/types/database";
import { KlaimStatusBadge } from "@/components/StatusBadge";
import {
  IconBox,
  IconCheckCircle,
  IconMail,
  IconPin,
  IconSearch,
  IconTrendUp,
} from "@/components/icons";

export const revalidate = 0;

type KlaimRow = {
  id: string;
  nama_pengklaim: string;
  no_hp: string;
  status: string;
  nomor_urut: number;
  created_at: string;
  items:
    | { nama_barang: string; kode_barang: string; lokasi_ditemukan: string }
    | { nama_barang: string; kode_barang: string; lokasi_ditemukan: string }[]
    | null;
};

function tombolTindakan(status: string, id: string) {
  switch (status) {
    case "MENUNGGU":
      return { label: "Periksa Klaim", href: `/dashboard/klaim/${id}`, tone: "solid" as const };
    case "DISETUJUI":
      return { label: "Proses Serah Terima", href: `/dashboard/pengembalian/${id}`, tone: "solid" as const };
    case "SELESAI":
      return { label: "Lihat Bukti", href: `/dashboard/pengembalian/${id}`, tone: "outline" as const };
    default:
      return { label: "Detail Penolakan", href: `/dashboard/klaim/${id}`, tone: "outline" as const };
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const tigaPuluhHariLalu = daysAgoIso(30);

  const [
    { count: barangTersimpan },
    { count: barangBaruBulanIni },
    { count: klaimMenunggu },
    { count: sudahDikembalikan },
    { count: pengembalianBulanIni },
    { count: klaimSelesai },
    { count: klaimDitolak },
    { data: klaimTerbaru },
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
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("status", "SELESAI"),
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("status", "DITOLAK"),
    supabase
      .from("claims")
      .select("id, nama_pengklaim, no_hp, status, nomor_urut, created_at, items(nama_barang, kode_barang, lokasi_ditemukan)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const totalDiproses = (klaimSelesai ?? 0) + (klaimDitolak ?? 0);
  const tingkatKeberhasilan =
    totalDiproses > 0 ? Math.round(((klaimSelesai ?? 0) / totalDiproses) * 100) : null;

  const klaimList = (klaimTerbaru ?? []) as unknown as KlaimRow[];

  return (
    <div className="space-y-6">
      {/* Header sambutan + aksi cepat */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-black/10 bg-white p-5 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-xs font-medium text-black/50">{todayFormatted()}</p>
          <h1 className="text-xl font-bold">Selamat Bertugas</h1>
          <p className="text-sm text-black/60">
            Balai Layanan Perpustakaan DPAD DIY — Meja Informasi Lobi Utama
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/dashboard/barang/tambah"
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5"
          >
            <IconBox className="h-4 w-4" />
            Catat Temuan Baru
          </Link>
          <Link
            href="/dashboard/klaim"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-dark"
          >
            <IconSearch className="h-4 w-4" />
            Verifikasi Klaim
          </Link>
        </div>
      </div>

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
          icon={<IconCheckCircle className="h-5 w-5" />}
          iconClass="bg-slate-100 text-slate-600"
          value={sudahDikembalikan ?? 0}
          label="Sudah Dikembalikan"
          trend={
            pengembalianBulanIni
              ? `+${pengembalianBulanIni} bulan ini`
              : tingkatKeberhasilan !== null
                ? `Tingkat berhasil ${tingkatKeberhasilan}%`
                : undefined
          }
        />
      </div>

      <div className="rounded-xl border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/10 p-4">
          <h2 className="font-semibold">Klaim Terbaru</h2>
          <Link
            href="/dashboard/klaim"
            className="text-sm text-brand-primary hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        {klaimList.length === 0 ? (
          <p className="p-6 text-center text-sm text-black/60">
            Belum ada pengajuan klaim.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-black/5 text-xs uppercase text-black/50">
                <tr>
                  <th className="px-4 py-3">Nomor Klaim</th>
                  <th className="px-4 py-3">Deskripsi Barang</th>
                  <th className="px-4 py-3">Data Pemohon</th>
                  <th className="px-4 py-3">Waktu Diajukan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {klaimList.map((klaim) => {
                  const item = Array.isArray(klaim.items) ? klaim.items[0] : klaim.items;
                  const aksi = tombolTindakan(klaim.status, klaim.id);

                  return (
                    <tr key={klaim.id}>
                      <td className="px-4 py-3 align-top">
                        <p className="font-mono text-xs font-semibold">
                          {formatNomorKlaim(klaim)}
                        </p>
                        <p className="font-mono text-[11px] text-black/40">
                          {item?.kode_barang}
                        </p>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium">{item?.nama_barang ?? "-"}</p>
                        {item?.lokasi_ditemukan && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-black/50">
                            <IconPin className="h-3 w-3 shrink-0" />
                            {item.lokasi_ditemukan}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium">{klaim.nama_pengklaim}</p>
                        <a href={`tel:${klaim.no_hp}`} className="text-xs text-brand-primary hover:underline">
                          {klaim.no_hp}
                        </a>
                      </td>
                      <td className="px-4 py-3 align-top text-black/60">
                        {formatTanggalWaktu(klaim.created_at)}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <KlaimStatusBadge status={klaim.status} />
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <Link
                          href={aksi.href}
                          className={
                            aksi.tone === "solid"
                              ? "inline-flex rounded-md bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-dark"
                              : "inline-flex rounded-md border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
                          }
                        >
                          {aksi.label}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
