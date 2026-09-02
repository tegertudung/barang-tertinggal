import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatTanggalWaktu } from "@/lib/format";
import { formatNomorKlaim } from "@/types/database";

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

  const { data, error } = await supabase
    .from("returns")
    .select(
      "id, tanggal_pengembalian, claims(id, nama_pengklaim, nomor_urut, created_at, items(nama_barang, kode_barang))"
    )
    .order("tanggal_pengembalian", { ascending: false });

  const riwayat = (data ?? []) as unknown as RiwayatRow[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Riwayat Pengembalian</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Seluruh barang yang sudah dikembalikan ke pemiliknya.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Gagal memuat riwayat: {error.message}
        </p>
      )}

      {!error && riwayat.length === 0 && (
        <p className="rounded-md border border-black/10 p-6 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
          Belum ada riwayat pengembalian.
        </p>
      )}

      {riwayat.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-black/5 text-xs uppercase text-black/60 dark:bg-white/10 dark:text-white/60">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3">Pengklaim</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {riwayat.map((r) => {
                const klaim = Array.isArray(r.claims) ? r.claims[0] : r.claims;
                const item = klaim
                  ? Array.isArray(klaim.items)
                    ? klaim.items[0]
                    : klaim.items
                  : null;

                return (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-mono text-xs">
                      {item?.kode_barang ?? "-"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item?.nama_barang ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      {klaim?.nama_pengklaim ?? "-"}
                      {klaim && (
                        <span className="ml-2 font-mono text-xs text-black/50 dark:text-white/50">
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
                          className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
                        >
                          Lihat
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
