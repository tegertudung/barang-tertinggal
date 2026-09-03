import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BarangCard } from "@/components/BarangCard";
import { SearchBar } from "@/components/SearchBar";
import { KategoriChips } from "@/components/KategoriChips";
import { Icon } from "@/components/Icon";
import type { Item } from "@/types/database";

export const revalidate = 0;

async function DaftarBarang({
  q,
  kategori,
  status,
}: {
  q: string;
  kategori: string;
  status: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*")
    .in("status", ["TERSIMPAN", "DIKLAIM"])
    .order("tanggal_ditemukan", { ascending: false });

  if (status) query = query.eq("status", status);
  if (kategori) query = query.eq("kategori", kategori);
  if (q) {
    query = query.or(
      `nama_barang.ilike.%${q}%,lokasi_ditemukan.ilike.%${q}%,kategori.ilike.%${q}%,kode_barang.ilike.%${q}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return (
      <p className="rounded-xl border border-m3-error/30 bg-m3-error-container p-4 text-sm text-m3-on-error-container">
        Gagal memuat data barang. Pastikan database sudah terhubung.
        <br />
        <span className="text-xs opacity-70">{error.message}</span>
      </p>
    );
  }

  const items = (data ?? []) as Item[];

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-2 rounded-2xl border border-m3-outline-variant/50 bg-m3-surface-container-lowest p-12 text-center shadow-sm">
        <span className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-m3-primary-container/10 text-m3-primary">
          <Icon name="search_off" className="!text-[36px]" />
        </span>
        <h3 className="font-bold text-m3-on-surface">Barang Belum Ditemukan</h3>
        <p className="max-w-md text-sm text-m3-on-surface-variant">
          Kata kunci atau filter yang Anda pilih tidak cocok dengan arsip
          penemuan saat ini. Coba ubah kata kunci atau kategori.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-m3-primary-container px-4 py-2.5 text-sm font-semibold text-m3-primary-container hover:bg-m3-primary-container hover:text-m3-on-primary"
        >
          <Icon name="restart_alt" className="!text-[18px]" />
          Reset Filter &amp; Pencarian
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
  const status = typeof params.status === "string" ? params.status : "";

  const supabase = await createClient();
  const [{ count: totalTersimpan }, { count: totalDikembalikan }, { count: totalSelesai }] =
    await Promise.all([
      supabase.from("items").select("*", { count: "exact", head: true }).eq("status", "TERSIMPAN"),
      supabase.from("items").select("*", { count: "exact", head: true }).eq("status", "DIKEMBALIKAN"),
      supabase.from("claims").select("*", { count: "exact", head: true }).eq("status", "SELESAI"),
    ]);

  return (
    <main className="w-full">
      {/* Notice / SOP callout */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-4 lg:px-6">
        <div className="flex items-start gap-3 rounded-xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest p-4 shadow-xs">
          <Icon name="verified_user" className="mt-0.5 !text-[24px] shrink-0 text-m3-primary" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-m3-on-surface">
                Penatausahaan Barang Temuan Balai Layanan Perpustakaan DIY
              </h2>
              <span className="rounded bg-m3-primary-container/10 px-2 py-0.5 text-xs font-bold text-m3-primary">
                SOP (contoh)
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-m3-on-surface-variant">
              Barang temuan pemustaka disimpan aman di Meja Informasi.
              Pemilik sah wajib menunjukkan identitas resmi (KTP/KTM/SIM)
              dan mendeskripsikan ciri khusus barang saat verifikasi.
              Lihat detail lengkap di{" "}
              <Link href="/panduan" className="font-semibold text-m3-primary hover:underline">
                Panduan &amp; SOP Klaim
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="w-full pb-8 pt-6">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-m3-primary/25 bg-m3-primary/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-m3-primary" />
                <span className="text-xs font-bold uppercase tracking-wide text-m3-primary">
                  Layanan Publik Terbuka &amp; Terpercaya
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-m3-on-surface">
                Cari &amp; Temukan Barang Anda yang Tertinggal
              </h1>
              <p className="mt-2 text-base leading-relaxed text-m3-on-surface-variant">
                Database inventaris resmi barang tertinggal di area Balai
                Layanan Perpustakaan. Cari nama barang, kode registrasi,
                atau lokasi ruangan di bawah ini.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-m3-outline-variant/50 bg-m3-surface-container-lowest p-2 shadow-xs lg:self-auto">
              <div className="border-r border-m3-outline-variant/40 px-3 py-1.5 text-center">
                <span className="block text-lg font-bold text-m3-primary">
                  {totalTersimpan ?? 0}
                </span>
                <span className="text-[11px] font-medium text-m3-on-surface-variant">
                  Tersimpan Aman
                </span>
              </div>
              <div className="border-r border-m3-outline-variant/40 px-3 py-1.5 text-center">
                <span className="block text-lg font-bold text-m3-secondary">
                  {totalDikembalikan ?? 0}
                </span>
                <span className="text-[11px] font-medium text-m3-on-surface-variant">
                  Telah Diserahkan
                </span>
              </div>
              <div className="px-3 py-1.5 text-center">
                <span className="block text-lg font-bold text-emerald-700">
                  {totalSelesai ?? 0}
                </span>
                <span className="text-[11px] font-medium text-m3-on-surface-variant">
                  Klaim Selesai
                </span>
              </div>
            </div>
          </div>

          {/* Search & filter card */}
          <div className="mt-6 space-y-4 rounded-2xl border border-m3-outline-variant/50 bg-m3-surface-container-lowest p-4 shadow-sm">
            <SearchBar />

            <div className="flex flex-col gap-3 border-t border-m3-outline-variant/30 pt-3 lg:flex-row lg:items-center lg:justify-between">
              <KategoriChips />

              <div className="flex shrink-0 items-center gap-1.5 border-t border-m3-outline-variant/20 pt-2 lg:border-t-0 lg:pt-0">
                <span className="mr-1 text-xs font-semibold text-m3-on-surface-variant">
                  Status:
                </span>
                <StatusChipLink label="Semua" value="" active={status === ""} />
                <StatusChipLink label="Tersimpan" value="TERSIMPAN" active={status === "TERSIMPAN"} />
                <StatusChipLink label="Verifikasi" value="DIKLAIM" active={status === "DIKLAIM"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog */}
      <section className="w-full pb-4">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <h2 className="mb-4 text-lg font-bold text-m3-on-surface">
            Katalog Temuan Terkini
          </h2>
          <Suspense fallback={<p className="text-sm text-m3-on-surface-variant">Memuat...</p>}>
            <DaftarBarang q={q} kategori={kategori} status={status} />
          </Suspense>
        </div>
      </section>

      {/* Prosedur ringkas */}
      <section className="w-full border-t border-m3-outline-variant/30 bg-m3-surface-container-low/60 py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-m3-secondary">
              Standard Operating Procedure
            </span>
            <h2 className="mt-1 text-2xl font-bold text-m3-primary">
              Prosedur Pengambilan Barang
            </h2>
            <p className="mt-2 text-sm text-m3-on-surface-variant">
              Ringkasan langkah resmi verifikasi penyerahan barang temuan.
              Detail lengkap ada di halaman{" "}
              <Link href="/panduan" className="font-semibold text-m3-primary hover:underline">
                Panduan &amp; SOP
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ProsedurCard
              nomor={1}
              icon="search"
              judul="Temukan & Cocokkan Data"
              deskripsi="Cari barang di katalog atau berdasarkan lokasi & tanggal, catat kode registrasinya."
            />
            <ProsedurCard
              nomor={2}
              icon="assignment_turned_in"
              judul="Verifikasi Ciri Spesifik"
              deskripsi="Ajukan klaim online dengan menyebutkan ciri khusus yang tidak dipublikasikan."
            />
            <ProsedurCard
              nomor={3}
              icon="badge"
              judul="Serah Terima & BAST"
              deskripsi="Datang ke Meja Informasi membawa identitas asli, tanda tangani BAST."
            />
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest p-6 shadow-xs md:flex-row">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-m3-primary-container text-m3-on-primary shadow-xs">
                <Icon name="support_agent" className="!text-[26px]" />
              </span>
              <div>
                <h4 className="font-bold text-m3-on-surface">
                  Butuh bantuan langsung?
                </h4>
                <p className="mt-0.5 text-sm text-m3-on-surface-variant">
                  Petugas Meja Informasi siap membantu koordinasi &amp;
                  pengecekan manual.
                </p>
              </div>
            </div>
            <span
              title="Nomor kontak masih contoh, akan diisi data resmi"
              className="inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-xl bg-m3-secondary-container/40 px-5 py-2.5 text-sm font-semibold text-m3-on-secondary-container opacity-70"
            >
              <Icon name="chat" className="!text-[18px]" />
              Kontak Meja Layanan (segera hadir)
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusChipLink({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  const href = value ? `/?status=${value}` : "/";
  return (
    <Link
      href={href}
      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
        active
          ? "bg-m3-primary-container text-m3-on-primary"
          : "border border-m3-outline-variant text-m3-on-surface-variant hover:border-m3-primary-container hover:text-m3-primary"
      }`}
    >
      {label}
    </Link>
  );
}

function ProsedurCard({
  nomor,
  icon,
  judul,
  deskripsi,
}: {
  nomor: number;
  icon: string;
  judul: string;
  deskripsi: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest p-6 shadow-xs transition-shadow hover:shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-m3-primary-container text-lg font-bold text-m3-on-primary shadow-xs">
          {nomor}
        </span>
        <Icon name={icon} className="!text-[28px] text-m3-primary" />
      </div>
      <h3 className="mb-1 font-bold text-m3-on-surface">{judul}</h3>
      <p className="text-sm leading-relaxed text-m3-on-surface-variant">
        {deskripsi}
      </p>
    </div>
  );
}
