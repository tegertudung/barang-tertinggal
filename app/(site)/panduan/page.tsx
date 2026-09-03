import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ContohKontenBanner } from "@/components/ContohKontenBanner";

export const metadata = { title: "Panduan & SOP Klaim — SI-BARTING" };

export default function PanduanPage() {
  return (
    <main className="w-full">
      <ContohKontenBanner />

      {/* Breadcrumb */}
      <div className="w-full bg-m3-surface-container-low py-2">
        <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 text-sm text-m3-on-surface-variant lg:px-6">
          <Link href="/" className="flex items-center gap-1 hover:text-m3-primary">
            <Icon name="home" className="!text-[16px]" />
            Beranda
          </Link>
          <Icon name="chevron_right" className="!text-[16px] text-m3-outline" />
          <span className="font-semibold text-m3-primary">Panduan &amp; SOP Klaim</span>
        </nav>
      </div>

      {/* Header */}
      <section className="w-full px-4 py-10 lg:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 rounded-2xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest p-6 shadow-sm lg:flex-row lg:items-center lg:p-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-m3-secondary">
              <span className="h-2 w-2 rounded-full bg-m3-secondary" />
              Balai Layanan Perpustakaan DPAD DIY
            </span>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-m3-primary">
              Panduan &amp; Prosedur Resmi Pengambilan Barang Tertinggal
            </h1>
            <p className="mt-2 text-base text-m3-on-surface-variant">
              Standar Operasional Prosedur (SOP) terpadu guna menjamin
              transparansi dan kepastian pengembalian barang temuan milik
              pemustaka.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col items-center rounded-xl bg-m3-surface-container-low p-4 lg:w-auto lg:min-w-[220px]">
            <Image
              src="/logo.jpg"
              alt="Logo Balai Yanpus DPAD DIY"
              width={80}
              height={80}
              className="mb-2 h-20 w-20 rounded-full object-cover"
            />
            <span className="text-center text-sm font-bold tracking-wide text-m3-primary">
              GRHATAMA PUSTAKA
            </span>
            <span className="text-center text-xs text-m3-on-surface-variant">
              Dinas Perpustakaan dan Arsip Daerah DIY
            </span>
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-5xl items-start gap-3 rounded-lg bg-m3-surface-container-low p-4">
          <Icon name="info" className="mt-0.5 !text-[22px] shrink-0 text-m3-primary-container" />
          <div>
            <span className="font-bold text-m3-primary">
              Asas Akuntabilitas &amp; Verifikasi Ketat
            </span>
            <p className="mt-1 text-sm text-m3-on-surface-variant">
              Setiap klaim wajib melewati verifikasi ciri rahasia oleh
              petugas Meja Layanan. Pihak perpustakaan berhak menolak
              penyerahan jika data pembuktian kepemilikan tidak sinkron.
            </p>
          </div>
        </div>
      </section>

      {/* 4-step workflow */}
      <section className="w-full bg-m3-surface-container px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-m3-secondary">
              Alur Pelayanan Publik
            </span>
            <h2 className="mt-1 text-2xl font-bold text-m3-primary">
              4 Tahap Pengambilan Barang Tertinggal
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StepCard nomor="01" icon="search_check" judul="Identifikasi Katalog" deskripsi="Cari nomor registrasi barang lewat katalog publik. Catat kode barangnya." />
            <StepCard nomor="02" icon="description" judul="Pengajuan Ciri Khusus" deskripsi="Isi formulir klaim daring dengan data rahasia yang tidak dipublikasikan." />
            <StepCard nomor="03" icon="badge" judul="Verifikasi Tatap Muka" deskripsi="Kunjungi Meja Informasi, tunjukkan identitas asli, cocokkan data bersama petugas." />
            <StepCard nomor="04" icon="draw" judul="Tanda Tangan BAST" deskripsi="Setelah tervalidasi, tanda tangani Berita Acara Serah Terima dan barang diserahkan." />
          </div>
        </div>
      </section>

      {/* Dokumen wajib */}
      <section className="w-full px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-m3-secondary">
                Persyaratan Administrasi
              </span>
              <h2 className="mt-1 text-2xl font-bold text-m3-primary">Dokumen Wajib Dibawa</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <DokumenCard
              icon="account_box"
              judul="1. Kartu Identitas Asli"
              items={["KTP Elektronik / IKD Digital", "Surat Izin Mengemudi (SIM)", "Kartu Tanda Mahasiswa (KTM) Aktif", "Kartu Anggota Perpustakaan"]}
              catatan="Nama harus sesuai data register pengajuan."
            />
            <DokumenCard
              icon="devices"
              judul="2. Bukti Tambahan Barang"
              items={["Nomor IMEI / Nota Pembelian gawai", "Kunci serep atau STNK (kendaraan)", "Mampu buka kode sandi perangkat", "Dokumen pembelian bila perhiasan"]}
              catatan="Khusus gawai, petugas akan meminta unlock perangkat."
            />
            <DokumenCard
              icon="assignment_ind"
              judul="3. Kuasa Pengambilan"
              items={["Surat Kuasa asli bermeterai", "Fotokopi KTP pemilik asli", "KTP asli penerima kuasa", "Pernyataan tanggung jawab tertulis"]}
              catatan="Format surat kuasa standar dapat diunduh di bawah."
            />
          </div>
        </div>
      </section>

      {/* Storage tiers */}
      <section className="w-full bg-m3-surface-container-low px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-m3-secondary">
              Regulasi Waktu &amp; Keamanan
            </span>
            <h2 className="mt-1 text-2xl font-bold text-m3-primary">
              Ketentuan Batas Simpan &amp; Perlakuan Khusus
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <TierCard
              badge="Masa Simpan Standar"
              badgeClass="bg-m3-surface-container text-m3-primary"
              icon="event_repeat"
              iconClass="text-m3-primary"
              judul="Maksimal 90 Hari Kalender"
              deskripsi="Berlaku untuk barang umum: buku, jaket, tumbler, payung, tas, alat tulis, dan kacamata."
              catatanLabel="Setelah 90 Hari:"
              catatan="Barang yang tidak diklaim didata ulang dan dilimpahkan sesuai ketentuan pengelolaan aset."
            />
            <TierCard
              badge="Keamanan Maksimal"
              badgeClass="bg-orange-100 text-orange-800"
              icon="lock"
              iconClass="text-m3-secondary"
              judul="Brankas Khusus & CCTV 24 Jam"
              deskripsi="Untuk laptop, ponsel, dompet berisi uang tunai, perhiasan, dan dokumen negara."
              catatanLabel="Protokol Keamanan:"
              catatan="Disimpan di lemari kode kombinasi ganda, hanya diakses otoritas 2 pejabat struktural."
            />
            <TierCard
              badge="Barang Lekas Rusak"
              badgeClass="bg-red-100 text-red-800"
              icon="timer"
              iconClass="text-red-600"
              judul="Batas 1 x 24 Jam"
              deskripsi="Berlaku untuk makanan basah, minuman olahan, obat tanpa resep, atau komoditas organik."
              catatanLabel="Sanitasi Gedung:"
              catatan="Barang yang rusak/basi dalam 24 jam dimusnahkan dengan berita acara ringkas."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-m3-primary-container px-4 py-16 text-m3-on-primary lg:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              Layanan Cepat Tanggap
            </span>
            <h2 className="mt-1 text-2xl font-bold">Siap Mengajukan Klaim Barang Anda?</h2>
            <p className="mt-2 text-sm text-white/80">
              Verifikasi kepemilikan Anda secara daring sebelum datang ke Balai.
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-m3-secondary-container px-6 py-3 text-sm font-semibold text-m3-on-secondary-container shadow-md hover:bg-m3-secondary hover:text-white sm:w-auto"
            >
              <Icon name="search" className="!text-[20px]" />
              Cari di Katalog
            </Link>
            <span
              title="Dokumen unduhan belum tersedia — masih contoh"
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium opacity-70 sm:w-auto"
            >
              <Icon name="download" className="!text-[18px]" />
              Unduh SOP (segera hadir)
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

function StepCard({ nomor, icon, judul, deskripsi }: { nomor: string; icon: string; judul: string; deskripsi: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-m3-primary-container text-sm font-bold text-m3-on-primary">
          {nomor}
        </span>
        <Icon name={icon} className="!text-[26px] text-m3-primary" />
      </div>
      <h3 className="mb-1 font-bold text-m3-on-surface">{judul}</h3>
      <p className="text-sm text-m3-on-surface-variant">{deskripsi}</p>
    </div>
  );
}

function DokumenCard({
  icon,
  judul,
  items,
  catatan,
}: {
  icon: string;
  judul: string;
  items: string[];
  catatan: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest shadow-sm">
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-m3-surface-container text-m3-primary">
          <Icon name={icon} className="!text-[26px]" />
        </span>
        <h3 className="font-bold text-m3-on-surface">{judul}</h3>
        <ul className="space-y-2 text-sm text-m3-on-surface-variant">
          {items.map((it) => (
            <li key={it} className="flex items-center gap-2">
              <Icon name="check_circle" className="!text-[18px] text-m3-primary" />
              {it}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-m3-surface-container-low p-4 text-xs text-m3-on-surface-variant">
        {catatan}
      </div>
    </div>
  );
}

function TierCard({
  badge,
  badgeClass,
  icon,
  iconClass,
  judul,
  deskripsi,
  catatanLabel,
  catatan,
}: {
  badge: string;
  badgeClass: string;
  icon: string;
  iconClass: string;
  judul: string;
  deskripsi: string;
  catatanLabel: string;
  catatan: string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-m3-outline-variant/40 bg-m3-surface-container-lowest p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded px-2 py-1 text-xs font-semibold ${badgeClass}`}>{badge}</span>
        <Icon name={icon} className={`!text-[24px] ${iconClass}`} />
      </div>
      <h3 className="mb-2 font-bold text-m3-on-surface">{judul}</h3>
      <p className="mb-4 text-sm text-m3-on-surface-variant">{deskripsi}</p>
      <div className="mt-auto rounded-lg bg-m3-surface-container-low p-3 text-sm text-m3-on-surface-variant">
        <strong className="mb-1 block text-m3-on-surface">{catatanLabel}</strong>
        {catatan}
      </div>
    </div>
  );
}
