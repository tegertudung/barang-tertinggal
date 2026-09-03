import { Icon } from "@/components/Icon";

/**
 * Banner peringatan bahwa sebagian/seluruh konten halaman ini masih
 * contoh (belum data resmi Balai). Lihat docs/PLACEHOLDER-DATA.md
 * untuk daftar lengkap yang perlu diganti sebelum go-live.
 */
export function ContohKontenBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-900">
      <span className="inline-flex items-center gap-1.5 font-medium">
        <Icon name="warning" className="!text-[18px]" />
        Halaman ini masih berisi <strong>konten contoh</strong> — akan
        diperbarui dengan data resmi dari Balai sebelum situs dipublikasikan.
      </span>
    </div>
  );
}
