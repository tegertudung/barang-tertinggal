import { Icon } from "@/components/Icon";

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

/** Nama ikon Material Symbols per kategori. */
export function kategoriIconName(kategori: string) {
  switch (kategori) {
    case "Dompet":
      return "account_balance_wallet";
    case "Tas":
      return "shopping_bag";
    case "Elektronik":
      return "devices";
    case "Kunci":
      return "key";
    case "Dokumen":
      return "description";
    case "Aksesoris":
      return "watch";
    case "Pakaian":
      return "checkroom";
    default:
      return "inventory_2";
  }
}

/**
 * Render ikon placeholder per kategori (dipakai di kartu barang &
 * detail). Sengaja berupa fungsi yang mengembalikan elemen JSX
 * (bukan reference komponen) supaya tidak dianggap "membuat komponen
 * saat render" oleh React Compiler.
 */
export function renderKategoriIcon(kategori: string, className?: string) {
  return <Icon name={kategoriIconName(kategori)} className={className} />;
}
