import Link from "next/link";
import { Icon } from "@/components/Icon";

function currentYear() {
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="w-full border-t border-m3-outline-variant/30 bg-m3-surface-container-low py-10">
      <div className="mx-auto max-w-5xl px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-m3-outline-variant/30 pb-8 md:grid-cols-12">
          <div className="space-y-2 md:col-span-6">
            <span className="text-lg font-bold text-m3-primary">
              SI-BARTING DPAD DIY
            </span>
            <p className="max-w-lg text-sm text-m3-on-surface-variant">
              Sistem Informasi Penatausahaan dan Pelaporan Barang Tertinggal
              di lingkungan Balai Layanan Perpustakaan, Dinas Perpustakaan
              dan Arsip Daerah Daerah Istimewa Yogyakarta.
            </p>
            <div className="flex flex-col gap-1.5 pt-2 text-sm text-m3-on-surface-variant">
              <div className="flex items-start gap-2">
                <Icon name="pin_drop" className="mt-0.5 !text-[18px] shrink-0 text-m3-primary" />
                <span>Alamat kantor (contoh — isi data resmi)</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="call" className="!text-[18px] shrink-0 text-m3-primary" />
                <span>Telepon Meja Informasi (contoh — isi data resmi)</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="chat" className="!text-[18px] shrink-0 text-m3-secondary" />
                <span>WhatsApp Meja Pelayanan (contoh — isi data resmi)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-3">
            <h4 className="font-semibold text-m3-on-surface">
              Layanan &amp; Informasi
            </h4>
            <ul className="space-y-1.5 text-sm text-m3-on-surface-variant">
              <li>
                <Link href="/" className="hover:text-m3-primary">
                  Katalog Barang Tertinggal
                </Link>
              </li>
              <li>
                <Link href="/panduan" className="hover:text-m3-primary">
                  Panduan &amp; SOP Klaim
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-m3-primary">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-m3-primary">
                  Masuk Petugas
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 md:col-span-3">
            <h4 className="font-semibold text-m3-on-surface">
              Tautan Terkait
            </h4>
            <ul className="space-y-1.5 text-sm text-m3-on-surface-variant">
              <li>
                <a
                  href="https://jogjaprov.go.id"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-1 hover:text-m3-primary"
                >
                  Portal Pemda DIY
                  <Icon name="north_east" className="!text-[14px]" />
                </a>
              </li>
              <li>
                <a
                  href="https://dpad.jogjaprov.go.id"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-1 hover:text-m3-primary"
                >
                  Website Resmi DPAD DIY
                  <Icon name="north_east" className="!text-[14px]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-4 text-sm text-m3-on-surface-variant md:flex-row">
          <p>
            © {currentYear()} Balai Layanan Perpustakaan — Dinas
            Perpustakaan dan Arsip Daerah D.I. Yogyakarta.
          </p>
          <span className="font-semibold text-m3-primary">
            Akuntabel • Melayani • Berintegritas
          </span>
        </div>
      </div>
    </footer>
  );
}
