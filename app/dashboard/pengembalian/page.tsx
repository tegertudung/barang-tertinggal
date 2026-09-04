import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatTanggalWaktu } from "@/lib/format";
import { formatNomorKlaim } from "@/types/database";
import { IconCheckCircle, IconFileText } from "@/components/icons";

export const revalidate = 0;

type RiwayatRow = {
  id: string;
  tanggal_pengembalian: string;
  claims: {
    id: string;
    nama_pengklaim: string;
    nomor_urut: number;
    created_at: string;
    items: { nama_barang: string; kode_barang: string } | { nama_barang: string; kode_barang: string }[] | null;
  } | {
    id: string;
    nama_pengklaim: string;
    nomor_urut: number;
    created_at: string;
    items: { nama_barang: string; kode_barang: string } | { nama_barang: string; kode_barang: string }[] | null;
  }[] | null;
};

export default async function RiwayatPengembalianPage() {
  const supabase = await createClient();

  const [{ data, error }, { count: totalTersimpanDanDikembalikan }] = await Promise.all([
    supabase
      .from("returns")
      .select(
        "id, tanggal_pengembalian, claims(id, nama_pengklaim, nomor_urut, created_at, items(nama_barang, kode_barang))"
      )
      .order("tanggal_pengembalian", { ascending: false }),
    supabase.from("items").select("*", { count: "exact", head: true }),
  ]);

  const riwayat = (data ?? []) as unknown as RiwayatRow[];
  const totalBarang = totalTersimpanDanDikembalikan ?? 0;
  const tingkatPengembalian =
    totalBarang > 0 ? Math.round((riwayat.length / totalBarang) * 100) : null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">
            Riwayat Pengembalian &amp; Berita Acara Serah Terima
          </h1>
          <p className="text-sm text-black/60">
            Rekapitulasi barang temuan yang telah dikembalikan kepada pemilik sah.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <div className="rounded-lg border border-black/10 bg-white px-4 py-2 text-center">
            <p className="flex items-center gap-1 text-xs font-medium text-black/50">
              <IconFileText className="h-3 w-3" />
              Total Berkas
            </p>
            <p className="text-lg font-bold">{riwayat.length}</p>
          </div>
          {tingkatPengembalian !== null && (
            <div className="rounded-lg border border-black/10 bg-white px-4 py-2 text-center">
              <p className="flex items-center gap-1 text-xs font-medium text-black/50">
                <IconCheckCircle className="h-3 w-3" />
                Tingkat Kembali
              </p>
              <p className="text-lg font-bold">{tingkatPengembalian}%</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Gagal memuat riwayat: {error.message}
        </p>
      )}

      {!error && riwayat.length === 0 && (
        <p className="rounded-md border border-black/10 bg-white p-6 text-center text-sm text-black/60">
          Belum ada riwayat pengembalian.
        </p>
      )}

      {riwayat.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-black/5 text-xs uppercase text-black/50">
              <tr>
                <th className="px-4 py-3">Kode Barang</th>
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3">Pengklaim</th>
                <th className="px-4 py-3">Waktu Penyerahan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {riwayat.map((r) => {
                const klaim = Array.isArray(r.claims) ? r.claims[0] : r.claims;
                const item = klaim
                  ? Array.isArray(klaim.items)
                    ? klaim.items[0]
                    : klaim.items
                  : null;

                return (
                  <tr key={r.id} className="hover:bg-black/5">
                    <td className="px-4 py-3 font-mono text-xs">
                      {item?.kode_barang ?? "-"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item?.nama_barang ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      {klaim?.nama_pengklaim ?? "-"}
                      {klaim && (
                        <span className="ml-2 font-mono text-xs text-black/50">
                          {formatNomorKlaim(klaim)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {formatTanggalWaktu(r.tanggal_pengembalian)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {klaim && (
                        <Link
                          href={`/dashboard/pengembalian/${klaim.id}`}
                          className="text-sm font-medium text-brand-primary hover:underline"
                        >
                          Lihat Bukti
                        </Link>
                      )}
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
