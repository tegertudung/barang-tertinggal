"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ContohKontenBanner } from "@/components/ContohKontenBanner";

type FaqItem = { q: string; a: string };
type FaqCategory = { key: string; label: string; icon: string; items: FaqItem[] };

const CATEGORIES: FaqCategory[] = [
  {
    key: "prosedur",
    label: "Prosedur & Alur Klaim",
    icon: "rule",
    items: [
      {
        q: "Bagaimana cara mengetahui apakah barang saya sudah ditemukan petugas?",
        a: "Periksa menu Daftar Barang pada Beranda. Masukkan perkiraan tanggal dan lokasi ruang Anda berkunjung. Jika ciri fisik awal cocok, catat kode barangnya untuk mempermudah proses klaim.",
      },
      {
        q: "Mengapa foto barang tidak ditampilkan secara utuh di halaman website?",
        a: "Ini standar pencegahan klaim fiktif. Foto disembunyikan agar pemilik sah dapat membuktikan kepemilikan dengan menyebutkan ciri khusus yang tidak dapat ditebak pihak lain.",
      },
      {
        q: "Apakah saya bisa langsung datang tanpa mengisi form klaim online dulu?",
        a: "Bisa. Anda dapat langsung menuju Meja Layanan Informasi pada jam layanan aktif. Namun mengisi form pra-klaim di portal ini disarankan supaya petugas bisa menyiapkan barang lebih cepat.",
      },
      {
        q: "Berapa lama petugas memverifikasi permohonan klaim online?",
        a: "Petugas memverifikasi secara berkala dalam waktu maksimal 1x24 jam kerja. Anda akan dihubungi melalui nomor HP yang didaftarkan saat mengajukan klaim.",
      },
    ],
  },
  {
    key: "waktu",
    label: "Batas Waktu & Penyimpanan",
    icon: "calendar_month",
    items: [
      {
        q: "Berapa lama masa simpan barang tertinggal?",
        a: "Masa penyimpanan standar untuk barang non-konsumsi adalah 90 hari kalender sejak tanggal barang diinventarisir. Setelah itu, barang yang tidak diklaim diproses sesuai ketentuan pengelolaan aset daerah.",
      },
      {
        q: "Bagaimana ketentuan untuk makanan atau benda yang lekas membusuk?",
        a: "Demi kebersihan area koleksi, makanan/minuman yang tertinggal hanya disimpan maksimal 1x24 jam. Tempat makan/tumbler tetap disimpan sesuai masa simpan normal setelah dicuci bersih.",
      },
      {
        q: "Apakah dikenakan biaya penyimpanan atau administrasi?",
        a: "Tidak dipungut biaya sama sekali. Seluruh layanan ini adalah bentuk pelayanan publik. Laporkan ke Meja Pengaduan bila ada oknum yang meminta imbalan.",
      },
    ],
  },
  {
    key: "dokumen",
    label: "Persyaratan & Dokumen",
    icon: "badge",
    items: [
      {
        q: "Dokumen apa saja yang wajib dibawa saat mengambil barang?",
        a: "Kartu identitas asli (KTP/SIM/KTM), kartu anggota perpustakaan (bila ada), bukti kepemilikan tambahan bila relevan, dan nomor registrasi klaim dari SI-BARTING bila sudah mengajukan online.",
      },
      {
        q: "Bagaimana bila identitas saya ikut tertinggal di dalam dompet yang hilang?",
        a: "Petugas akan memakai metode verifikasi alternatif: pengecekan IKD di smartphone, verifikasi database keanggotaan, atau pencocokan tanda tangan dengan dokumen di dalam dompet tersebut.",
      },
      {
        q: "Apakah pengambilan barang bisa diwakilkan?",
        a: "Bisa, dengan Surat Kuasa bermeterai yang ditandatangani pemilik & penerima kuasa, fotokopi identitas pemilik, dan KTP asli penerima kuasa untuk diverifikasi petugas.",
      },
    ],
  },
  {
    key: "khusus",
    label: "Barang Khusus / Berharga",
    icon: "devices",
    items: [
      {
        q: "Bagaimana verifikasi untuk laptop/ponsel yang terkunci layar?",
        a: "Pemohon wajib membuka kunci layar langsung di hadapan petugas, serta mencocokkan nomor IMEI bila memungkinkan. Tersedia stasiun pengisian daya bila gawai kehabisan baterai.",
      },
      {
        q: "Apakah isi tas atau file gawai saya aman selama disimpan?",
        a: "Dijamin. Setiap penemuan melewati proses pengecekan oleh minimal dua petugas dengan saksi koordinator keamanan. Petugas dilarang membuka data pribadi gawai selain untuk verifikasi kepemilikan.",
      },
    ],
  },
];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const totalCount = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => {
        const matchCat = activeCategory === "all" || cat.key === activeCategory;
        const matchQuery =
          q === "" || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
        return matchCat && matchQuery;
      }),
    })).filter((cat) => cat.items.length > 0);
  }, [query, activeCategory]);

  return (
    <main className="w-full">
      <ContohKontenBanner />

      <div className="w-full bg-m3-surface-container-low py-2">
        <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 text-sm text-m3-on-surface-variant lg:px-6">
          <Link href="/" className="flex items-center gap-1 hover:text-m3-primary">
            <Icon name="home" className="!text-[16px]" />
            Beranda
          </Link>
          <Icon name="chevron_right" className="!text-[16px] text-m3-outline" />
          <span className="font-semibold text-m3-primary">Tanya Jawab (FAQ)</span>
        </nav>
      </div>

      <section className="w-full px-4 py-10 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-m3-secondary">
              Bantuan &amp; Panduan Terpadu
            </span>
            <h1 className="mt-1 text-3xl font-bold text-m3-primary">
              Tanya Jawab Seputar Barang Tertinggal
            </h1>
            <p className="mt-2 text-base text-m3-on-surface-variant">
              Panduan cepat mengenai prosedur, jangka waktu penyimpanan,
              keabsahan dokumen, hingga pengambilan langsung di Balai.
            </p>
          </div>

          {/* Search */}
          <div className="mt-6 flex flex-col gap-2 rounded-xl border border-m3-outline-variant/50 bg-m3-surface-container-lowest p-2 shadow-sm md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-lg bg-m3-surface-container-low px-3 py-2">
              <Icon name="search" className="!text-[22px] text-m3-outline" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik pertanyaan atau kata kunci..."
                className="w-full bg-transparent text-sm text-m3-on-surface outline-none placeholder:text-m3-outline"
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            <CatPill
              label="Semua Pertanyaan"
              count={totalCount}
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {CATEGORIES.map((c) => (
              <CatPill
                key={c.key}
                label={c.label}
                count={c.items.length}
                active={activeCategory === c.key}
                onClick={() => setActiveCategory(c.key)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="w-full pb-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest p-10 text-center shadow-sm">
              <Icon name="search_off" className="!text-[32px] text-m3-outline" />
              <h4 className="mt-2 font-bold text-m3-on-surface">
                Tidak Ditemukan Jawaban yang Cocok
              </h4>
              <p className="mx-auto mt-1 max-w-md text-sm text-m3-on-surface-variant">
                Coba kata kunci lain, atau hubungi Meja Bantuan langsung.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filtered.map((cat) => (
                <div key={cat.key}>
                  <div className="mb-2 flex items-center gap-2">
                    <Icon name={cat.icon} className="!text-[22px] text-m3-primary" />
                    <h3 className="text-lg font-bold text-m3-primary">{cat.label}</h3>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item) => {
                      const key = `${cat.key}::${item.q}`;
                      const open = openKey === key;
                      return (
                        <div
                          key={key}
                          className="overflow-hidden rounded-xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest shadow-xs"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenKey(open ? null : key)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-m3-surface-container-low"
                          >
                            <span className="text-sm font-semibold text-m3-on-surface">
                              {item.q}
                            </span>
                            <Icon
                              name={open ? "expand_less" : "expand_more"}
                              className="!text-[20px] shrink-0 text-m3-outline"
                            />
                          </button>
                          {open && (
                            <div className="border-t border-m3-outline-variant/20 bg-m3-surface-container-low/30 px-4 py-3 text-sm leading-relaxed text-m3-on-surface-variant">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CatPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium shadow-xs transition-all ${
        active
          ? "bg-m3-primary-container text-m3-on-primary"
          : "bg-m3-surface-container-lowest text-m3-on-surface-variant hover:bg-m3-surface-container hover:text-m3-primary"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-xs ${
          active ? "bg-white/20" : "bg-m3-surface-container text-m3-on-surface-variant"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
