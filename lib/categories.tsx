import {
  IconBag,
  IconBox,
  IconFileText,
  IconKey,
  IconPlug,
  IconShirt,
  IconWallet,
} from "@/components/icons";

/**
 * Daftar kategori barang. Dipakai untuk filter di halaman publik
 * maupun pilihan pada form tambah/edit barang petugas.
 */
export const KATEGORI_LIST = [
  "Dompet",
  "Tas",
  "Elektronik",
  "Kunci",
  "Dokumen",
  "Aksesoris",
  "Pakaian",
  "Lainnya",
] as const;

export type Kategori = (typeof KATEGORI_LIST)[number];

/**
 * Render ikon placeholder per kategori (dipakai di kartu barang &
 * detail). Sengaja berupa fungsi yang mengembalikan elemen JSX
 * (bukan reference komponen) supaya tidak dianggap "membuat komponen
 * saat render" oleh React Compiler.
 */
export function renderKategoriIcon(kategori: string, className?: string) {
  switch (kategori) {
    case "Dompet":
    case "Aksesoris":
      return <IconWallet className={className} />;
    case "Tas":
      return <IconBag className={className} />;
    case "Elektronik":
      return <IconPlug className={className} />;
    case "Kunci":
      return <IconKey className={className} />;
    case "Dokumen":
      return <IconFileText className={className} />;
    case "Pakaian":
      return <IconShirt className={className} />;
    default:
      return <IconBox className={className} />;
  }
}
