import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/format";
import { DeleteBarangButton } from "@/components/DeleteBarangButton";
import { BarangStatusBadge } from "@/components/StatusBadge";
import type { Item } from "@/types/database";

export const revalidate = 0;

export default async function DataBarangPage({
  searchParams,
}: PageProps<"/dashboard/barang">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? params.status : "";

  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (q) {
    query = query.or(
      `nama_barang.ilike.%${q}%,kode_barang.ilike.%${q}%,lokasi_ditemukan.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  const items = (data ?? []) as Item[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Data Barang</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Kelola barang tertinggal yang tercatat.
          </p>
        </div>
        <Link
          href="/dashboard/barang/tambah"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          + Tambah Barang
        </Link>
      </div>

      <form className="mb-4 flex flex-wrap gap-2" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari kode, nama, atau lokasi..."
          className="w-full max-w-xs rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/20 dark:bg-white/5"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/20 dark:bg-white/5"
        >
          <option value="">Semua Status</option>
          <option value="TERSIMPAN">Tersimpan</option>
          <option value="DIKLAIM">Diklaim</option>
          <option value="DIKEMBALIKAN">Dikembalikan</option>
        </select>
        <button
          type="submit"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Gagal memuat data barang: {error.message}
        </p>
      )}

      {!error && items.length === 0 && (
        <p className="rounded-md border border-black/10 p-6 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
          Belum ada barang yang cocok.
        </p>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-black/5 text-xs uppercase text-black/60 dark:bg-white/10 dark:text-white/60">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama Barang</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-mono text-xs">
                    {item.kode_barang}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {item.nama_barang}
                  </td>
                  <td className="px-4 py-3">{item.kategori}</td>
                  <td className="px-4 py-3">{item.lokasi_ditemukan}</td>
                  <td className="px-4 py-3">
                    {formatTanggal(item.tanggal_ditemukan)}
                  </td>
                  <td className="px-4 py-3">
                    <BarangStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/dashboard/barang/${item.id}/edit`}
                        className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
                      >
                        Edit
                      </Link>
                      <DeleteBarangButton id={item.id} nama={item.nama_barang} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
