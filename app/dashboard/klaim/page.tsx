import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatTanggalWaktu } from "@/lib/format";
import { formatNomorKlaim } from "@/types/database";
import { KlaimStatusBadge } from "@/components/StatusBadge";
import { IconPin, IconSearch } from "@/components/icons";

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

const TABS = [
  { value: "MENUNGGU", label: "Menunggu Verifikasi" },
  { value: "DISETUJUI", label: "Disetujui" },
  { value: "DITOLAK", label: "Ditolak" },
  { value: "SELESAI", label: "Selesai Dikembalikan" },
];

export default async function DaftarKlaimPage({
  searchParams,
}: PageProps<"/dashboard/klaim">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "MENUNGGU";
  const q = typeof params.q === "string" ? params.q : "";

  const supabase = await createClient();

  let query = supabase
    .from("claims")
    .select("id, nama_pengklaim, no_hp, status, nomor_urut, created_at, items(nama_barang, kode_barang, lokasi_ditemukan)")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`nama_pengklaim.ilike.%${q}%,no_hp.ilike.%${q}%`);
  }

  const [{ data, error }, counts] = await Promise.all([
    query,
    Promise.all(
      TABS.map((t) =>
        supabase.from("claims").select("*", { count: "exact", head: true }).eq("status", t.value)
      )
    ),
  ]);

  const klaimList = (data ?? []) as unknown as KlaimRow[];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Daftar Pengajuan Klaim Pemustaka</h1>
        <p className="text-sm text-black/60">
          Verifikasi keabsahan data kepemilikan barang temuan yang diajukan pemustaka.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <Link
            key={t.value}
            href={`/dashboard/klaim?status=${t.value}`}
            className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${
              status === t.value
                ? "border-brand-primary bg-brand-primary text-white"
                : "border-black/10 bg-white text-black/70 hover:bg-black/5"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                status === t.value ? "bg-white/20" : "bg-black/5"
              }`}
            >
              {counts[i].count ?? 0}
            </span>
          </Link>
        ))}
      </div>

      <form className="mb-4 flex flex-wrap gap-2" method="get">
        <input type="hidden" name="status" value={status} />
        <div className="relative w-full max-w-sm">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Cari nama pemohon atau nomor HP..."
            className="w-full rounded-md border border-black/15 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Gagal memuat klaim: {error.message}
        </p>
      )}

      {!error && klaimList.length === 0 && (
        <p className="rounded-md border border-black/10 bg-white p-6 text-center text-sm text-black/60">
          Tidak ada klaim pada status ini.
        </p>
      )}

      {klaimList.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-black/5 text-xs uppercase text-black/50">
              <tr>
                <th className="px-4 py-3">Nomor Klaim</th>
                <th className="px-4 py-3">Barang Terkait</th>
                <th className="px-4 py-3">Pengklaim</th>
                <th className="px-4 py-3">Nomor HP</th>
                <th className="px-4 py-3">Tanggal Pengajuan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {klaimList.map((klaim) => {
                const item = Array.isArray(klaim.items) ? klaim.items[0] : klaim.items;
                return (
                  <tr key={klaim.id} className="cursor-pointer hover:bg-black/5">
                    <td className="px-4 py-3 align-top">
                      <Link href={`/dashboard/klaim/${klaim.id}`} className="font-mono text-xs font-semibold text-brand-primary hover:underline">
                        {formatNomorKlaim(klaim)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="font-medium">{item?.nama_barang ?? "-"}</p>
                      <p className="font-mono text-[11px] text-black/40">{item?.kode_barang}</p>
                      {item?.lokasi_ditemukan && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-black/50">
                          <IconPin className="h-3 w-3 shrink-0" />
                          {item.lokasi_ditemukan}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top font-medium">{klaim.nama_pengklaim}</td>
                    <td className="px-4 py-3 align-top">
                      <a href={`tel:${klaim.no_hp}`} className="text-brand-primary hover:underline">
                        {klaim.no_hp}
                      </a>
                    </td>
                    <td className="px-4 py-3 align-top text-black/60">
                      {formatTanggalWaktu(klaim.created_at)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <KlaimStatusBadge status={klaim.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
