import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";

const NAV_LINKS = [
  { href: "/", label: "Daftar Barang" },
  { href: "/panduan", label: "Panduan & SOP Klaim" },
  { href: "/faq", label: "Tanya Jawab (FAQ)" },
];

export function Navbar() {
  return (
    <header className="w-full border-b border-m3-outline-variant/30 bg-m3-surface-container-lowest">
      {/* Strip info instansi */}
      <div className="bg-m3-primary-container px-4 py-1.5 text-xs font-medium text-m3-on-primary">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1 sm:flex-row">
          <span className="flex items-center gap-1.5">
            <Icon name="location_on" className="!text-[15px]" />
            Alamat kantor (contoh — isi data resmi)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Jam layanan (contoh — isi jadwal resmi)
          </span>
        </div>
      </div>

      {/* Header utama */}
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Logo Balai Yanpus DPAD DIY"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold uppercase tracking-wider text-m3-secondary">
              Pemerintah Daerah D.I. Yogyakarta
            </span>
            <span className="font-bold text-m3-primary">
              Balai Layanan Perpustakaan DPAD DIY
            </span>
            <span className="text-xs font-medium text-m3-on-surface-variant">
              Sistem Informasi Barang Tertinggal (SI-BARTING)
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-m3-on-surface-variant transition-colors hover:text-m3-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-lg border border-m3-primary-container px-3 py-2 text-sm font-medium text-m3-primary transition-colors hover:bg-m3-primary-container hover:text-m3-on-primary"
          >
            <Icon name="lock" className="!text-[16px]" />
            <span className="hidden sm:inline">Masuk Petugas</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
