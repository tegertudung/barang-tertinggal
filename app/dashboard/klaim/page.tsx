import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatTanggalWaktu, labelStatusKlaim } from "@/lib/format";
import { formatNomorKlaim } from "@/types/database";

export const revalidate = 0;

type KlaimRow = {
  id: string;
  nama_pengklaim: string;
  status: string;
  nomor_urut: number;
  created_at: string;
  items: { nama_barang: string; kode_barang: string } | { nama_barang: string; kode_barang: string }[] | null;
};

export default async function DaftarKlaimPage({
  searchParams,
}: PageProps<"/dashboard/klaim">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "";

  const supabase = await createClient();

  let query = supabase
    .from("claims")
    .select("id, nama_pengklaim, status, nomor_urut, created_at, items(nama_barang, kode_barang)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  const klaimList = (data ?? []) as unknown as KlaimRow[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Klaim Barang</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Seluruh pengajuan klaim dari pengunjung.
        </p>
      </div>

      <form className="mb-4 flex flex-wrap gap-2" method="get">
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/20 dark:bg-white/5"
        >
          <option value="">Semua Status</option>
          <option value="MENUNGGU">Menunggu Verifikasi</option>
          <option value="DISETUJUI">Disetujui</option>
          <option value="DITOLAK">Ditolak</option>
          <option value="SELESAI">Selesai</option>
        </select>
        <button
          type="submit"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Filter
        </button>
      </form>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Gagal memuat klaim: {error.message}
        </p>
      )}

      {!error && klaimList.length === 0 && (
        <p className="rounded-md border border-black/10 p-6 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
          Belum ada pengajuan klaim.
        </p>
      )}

      {klaimList.length > 0 && (
        <div className="divide-y divide-black/10 rounded-md border border-black/10 dark:divide-white/10 dark:border-white/10">
          {klaimList.map((klaim) => {
            const item = Array.isArray(klaim.items)
              ? klaim.items[0]
              : klaim.items;

            return (
              <Link
                key={klaim.id}
                href={`/dashboard/klaim/${klaim.id}`}
                className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div>
                  <p className="font-mono text-xs text-black/50 dark:text-white/50">
                    {formatNomorKlaim(klaim)}
                  </p>
                  <p className="font-medium">{item?.nama_barang ?? "-"}</p>
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
  );
}
