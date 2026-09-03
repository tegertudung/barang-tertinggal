/**
 * Ikon Material Symbols (Google Fonts), dipakai di halaman publik v2
 * (Beranda, Panduan & SOP, FAQ) sesuai mockup client. Area petugas
 * tetap pakai set SVG kustom di components/icons.tsx (tidak diubah).
 */
export function Icon({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={filled ? { fontVariationSettings: '"FILL" 1' } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
