import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BarangCard } from "@/components/BarangCard";
import { SearchBar } from "@/components/SearchBar";
import { KategoriChips } from "@/components/KategoriChips";
import { IconBriefcase, IconFileText, IconSearch } from "@/components/icons";
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
      <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Gagal memuat data barang. Pastikan database sudah terhubung.
        <br />
        <span className="text-xs opacity-70">{error.message}</span>
      </p>
    );
  }

  const items = (data ?? []) as Item[];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-black/15 py-16 text-center">
        <IconSearch className="h-8 w-8 text-black/25" />
        <p className="font-medium">Tidak ada barang yang cocok</p>
        <p className="max-w-xs text-sm text-black/50">
          Coba ubah kata kunci pencarian atau pilih kategori lain.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
        <section className="rounded-xl bg-brand-primary p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Barang Tertinggal
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-white/70">
            Temukan dan ajukan klaim atas barang yang tertinggal di
            lingkungan Balai Perpustakaan DPAD DIY.
          </p>
          <div className="mt-5 max-w-xl">
            <SearchBar />
          </div>
        </section>

        {!q && !kategori && (
          <Link
            href="/?q=xxxxxxtidakada"
            className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
          >
            Lihat contoh hasil kosong
          </Link>
        )}
        {(q || kategori) && (
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
          >
            ← Reset pencarian
          </Link>
        )}

        <div className="mt-4">
          <KategoriChips />
        </div>

        <section className="mt-6">
          <Suspense fallback={<p className="text-sm text-black/50">Memuat...</p>}>
            <DaftarBarang q={q} kategori={kategori} />
          </Suspense>
        </section>

        <section className="mt-12 border-t border-black/10 pt-8">
          <h2 className="mb-5 text-lg font-bold tracking-tight">
            Cara Mengklaim Barang
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StepCard
              nomor={1}
              icon={<IconSearch className="h-4 w-4" />}
              judul="Cari Barang"
              deskripsi="Gunakan pencarian atau filter kategori untuk menemukan barang Anda."
            />
            <StepCard
              nomor={2}
              icon={<IconFileText className="h-4 w-4" />}
              judul="Ajukan Klaim"
              deskripsi="Isi formulir klaim dengan data diri dan ciri-ciri barang."
            />
            <StepCard
              nomor={3}
              icon={<IconBriefcase className="h-4 w-4" />}
              judul="Ambil di Meja Layanan"
              deskripsi="Datang membawa identitas diri (KTP/SIM/KTM) yang masih berlaku."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function StepCard({
  nomor,
  icon,
  judul,
  deskripsi,
}: {
  nomor: number;
  icon: React.ReactNode;
  judul: string;
  deskripsi: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white">
          {nomor}
        </span>
        <span className="text-brand-primary">{icon}</span>
      </div>
      <h3 className="font-semibold">{judul}</h3>
      <p className="mt-1 text-sm text-black/60">{deskripsi}</p>
    </div>
  );
}
