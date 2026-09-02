import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { BarangCard } from "@/components/BarangCard";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import type { Item } from "@/types/database";

export const revalidate = 0;

async function DaftarBarang({
  q,
  kategori,
}: {
  q: string;
  kategori: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*")
    .in("status", ["TERSIMPAN", "DIKLAIM"])
    .order("tanggal_ditemukan", { ascending: false });

  if (kategori) query = query.eq("kategori", kategori);
  if (q) {
    query = query.or(
      `nama_barang.ilike.%${q}%,lokasi_ditemukan.ilike.%${q}%,kategori.ilike.%${q}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Gagal memuat data barang. Pastikan database sudah terhubung.
        <br />
        <span className="text-xs opacity-70">{error.message}</span>
      </p>
    );
  }

  const items = (data ?? []) as Item[];

  if (items.length === 0) {
    return (
      <p className="rounded-md border border-black/10 p-6 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
        Belum ada barang yang cocok dengan pencarian Anda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <BarangCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default async function BerandaPage({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const kategori = typeof params.kategori === "string" ? params.kategori : "";

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <section className="mb-8 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">BARANG TERTINGGAL</h1>
        <p className="mt-1 text-black/60 dark:text-white/60">
          Balai Perpustakaan DPAD DIY
        </p>
        <p className="mt-4 text-sm text-black/70 dark:text-white/70">
          Cari barang yang mungkin Anda kehilangan di area perpustakaan.
        </p>
      </section>

      <section className="mb-6">
        <SearchFilterBar />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
          Barang Tertinggal
        </h2>
        <Suspense fallback={<p className="text-sm">Memuat...</p>}>
          <DaftarBarang q={q} kategori={kategori} />
        </Suspense>
      </section>

      <section className="mt-12 rounded-lg border border-black/10 bg-black/5 p-4 text-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-2 font-semibold">Prosedur Klaim Barang</h2>
        <ol className="list-inside list-decimal space-y-1 text-black/70 dark:text-white/70">
          <li>Cari barang Anda pada daftar di atas.</li>
          <li>Buka detail barang, lalu klik &quot;Saya Pemilik Barang Ini&quot;.</li>
          <li>Isi form pengajuan klaim dengan data yang benar.</li>
          <li>Tunggu proses verifikasi oleh petugas Layanan dan Informasi.</li>
          <li>
            Setelah klaim disetujui, datang langsung ke perpustakaan untuk
            mengambil barang.
          </li>
        </ol>
      </section>
    </main>
  );
}
