/**
 * Daftar kategori barang. Dipakai untuk filter di halaman publik
 * maupun pilihan pada form tambah/edit barang petugas.
 */
export const KATEGORI_LIST = [
  "Dompet",
  "Tas",
  "Elektronik",
  "Dokumen",
  "Aksesoris",
  "Pakaian",
  "Lainnya",
] as const;

export type Kategori = (typeof KATEGORI_LIST)[number];
