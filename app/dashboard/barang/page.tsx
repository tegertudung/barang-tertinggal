import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/format";
import { DeleteBarangButton } from "@/components/DeleteBarangButton";
import { BarangStatusBadge } from "@/components/StatusBadge";
import { KATEGORI_LIST } from "@/lib/categories";
import { getBarangFotoUrl } from "@/lib/storage";
import { IconBox, IconClock, IconInfo, IconLock, IconMail } from "@/components/icons";
import { ContohTag } from "@/components/ContohTag";
import { ExportCsvButton } from "@/components/ExportCsvButton";
import type { Item } from "@/types/database";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const revalidate = 0;

export default async function DataBarangPage({
  searchParams,
}: PageProps<"/dashboard/barang">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? params.status : "";
  const kategori = typeof params.kategori === "string" ? params.kategori : "";
  const hariIni = params.hari_ini === "1";

  const supabase = await createClient();
  const hariIniIso = todayIso();

  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (kategori) query = query.eq("kategori", kategori);
  if (hariIni) query = query.eq("tanggal_ditemukan", hariIniIso);
  if (q) {
    query = query.or(
      `nama_barang.ilike.%${q}%,kode_barang.ilike.%${q}%,lokasi_ditemukan.ilike.%${q}%`
    );
  }

  const [
    { data, error },
    { count: totalTersimpan },
    { count: totalKlaimBerjalan },
    { data: klaimSelesaiAtauSetuju },
  ] = await Promise.all([
    query,
    supabase.from("items").select("*", { count: "exact", head: true }).eq("status", "TERSIMPAN"),
    supabase.from("claims").select("*", { count: "exact", head: true }).in("status", ["MENUNGGU", "DISETUJUI"]),
    supabase.from("claims").select("created_at, updated_at").in("status", ["DISETUJUI", "SELESAI"]),
  ]);

  const items = (data ?? []) as Item[];

  let rataRataHari: number | null = null;
  if (klaimSelesaiAtauSetuju && klaimSelesaiAtauSetuju.length > 0) {
    const totalMs = klaimSelesaiAtauSetuju.reduce((sum, k) => {
      return sum + (new Date(k.updated_at).getTime() - new Date(k.created_at).getTime());
    }, 0);
    rataRataHari = totalMs / klaimSelesaiAtauSetuju.length / (1000 * 60 * 60 * 24);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Data Inventaris Barang Tertinggal</h1>
          <p className="text-sm text-black/60">
            Kelola pencatatan dan status fisik barang temuan pemustaka.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold">
            <IconBox className="h-3.5 w-3.5 text-green-700" />
            Tersimpan: {totalTersimpan ?? 0}
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold">
            <IconMail className="h-3.5 w-3.5 text-amber-700" />
            Klaim Berjalan: {totalKlaimBerjalan ?? 0}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-start gap-3 rounded-lg border-l-4 border-brand-primary bg-white p-4 text-sm shadow-xs">
        <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
        <p className="text-black/70">
          <strong>Prosedur Standar Penyimpanan Fisik.</strong> Setiap temuan
          harus disegel dan dicocokkan fisiknya di lemari/brankas
          penyimpanan sebelum status diubah.
          <ContohTag />
        </p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-black/50">Pintasan Cepat:</span>
        <Link
          href={hariIni ? "/dashboard/barang" : "/dashboard/barang?hari_ini=1"}
          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
            hariIni
              ? "border-brand-primary bg-brand-primary text-white"
              : "border-black/15 bg-white text-black/70 hover:bg-black/5"
          }`}
        >
          <IconClock className="h-3 w-3" />
          Temuan Hari Ini
        </Link>
        <span className="flex cursor-not-allowed items-center gap-1 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/40">
          Nilai Tinggi (Elektronik/Dompet)
          <ContohTag />
        </span>
        <span className="flex cursor-not-allowed items-center gap-1 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/40">
          Mendekati Masa Simpan 30 Hari
          <ContohTag />
        </span>
      </div>

      <form className="mb-4 flex flex-wrap items-center gap-2" method="get">
        {hariIni && <input type="hidden" name="hari_ini" value="1" />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari kode barang, nama..."
          className="w-full max-w-xs rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary"
        />
        <select
          name="kategori"
          defaultValue={kategori}
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary"
        >
          <option value="">Semua Kategori</option>
          {KATEGORI_LIST.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary"
        >
          <option value="">Semua Status</option>
          <option value="TERSIMPAN">Tersimpan</option>
          <option value="DIKLAIM">Diklaim</option>
          <option value="DIKEMBALIKAN">Dikembalikan</option>
        </select>
        <button
          type="submit"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5"
        >
          Cari
        </button>

        <Link
          href="/dashboard/barang/tambah"
          className="ml-auto rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-dark"
        >
          + Tambah Barang
        </Link>
      </form>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Gagal memuat data barang: {error.message}
        </p>
      )}

      {!error && items.length === 0 && (
        <p className="rounded-md border border-black/10 p-6 text-center text-sm text-black/60">
          Belum ada barang yang cocok.
        </p>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-black/10">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-black/5 text-xs uppercase text-black/60">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Foto Fisik</th>
                <th className="px-4 py-3">Nama Barang</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {items.map((item) => {
                const fotoUrl = getBarangFotoUrl(item.foto);
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-mono text-xs">
                      {item.kode_barang}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-black/10 bg-black/5">
                        {fotoUrl ? (
                          <Image src={fotoUrl} alt="" fill sizes="40px" className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-black/25">
                            <IconLock className="h-4 w-4" />
                          </div>
                        )}
                      </div>
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
                          className="text-sm font-medium text-brand-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteBarangButton id={item.id} nama={item.nama_barang} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 text-black/50">
            <IconBox className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-black/50">
              Loker Penyimpanan Terpakai
              <ContohTag />
            </p>
            <p className="text-lg font-bold">18 / 30 Kompartemen</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <IconClock className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-black/50">Rata-rata Waktu Terklaim</p>
            <p className="text-lg font-bold">
              {rataRataHari !== null ? `${rataRataHari.toFixed(1)} Hari` : "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-4">
          <div>
            <p className="text-xs text-black/50">Ekspor Data</p>
            <p className="text-sm font-medium">Rekap barang sesuai filter</p>
          </div>
          <ExportCsvButton items={items} />
        </div>
      </div>
    </div>
  );
}
