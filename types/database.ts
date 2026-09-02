/**
 * Tipe domain untuk Sistem Informasi Barang Tertinggal.
 * Mengikuti struktur tabel pada docs/DATABASE.md.
 */

export type ItemStatus = "TERSIMPAN" | "DIKLAIM" | "DIKEMBALIKAN";

export type ClaimStatus = "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "SELESAI";

export interface Profile {
  id: string; // = auth.users.id
  nama: string;
  status: string;
  created_at: string;
}

export interface Item {
  id: string;
  kode_barang: string;
  nama_barang: string;
  kategori: string;
  warna: string | null;
  deskripsi: string | null;
  lokasi_ditemukan: string;
  tanggal_ditemukan: string; // date (YYYY-MM-DD)
  foto: string | null; // path/URL di Supabase Storage
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: string;
  item_id: string;
  nama_pengklaim: string;
  no_hp: string;
  waktu_kehilangan: string | null;
  lokasi_kehilangan: string | null;
  ciri_barang: string;
  keterangan: string | null;
  status: ClaimStatus;
  catatan_petugas: string | null;
  nomor_urut: number;
  created_at: string;
  updated_at: string;
}

/** Format tampilan: CLM-2026-001 */
export function formatNomorKlaim(claim: Pick<Claim, "nomor_urut" | "created_at">) {
  const year = new Date(claim.created_at).getFullYear();
  return `CLM-${year}-${String(claim.nomor_urut).padStart(3, "0")}`;
}

export interface Return {
  id: string;
  claim_id: string;
  petugas_id: string;
  tanggal_pengembalian: string;
  foto_serah_terima: string | null; // path di Supabase Storage (private)
  catatan: string | null;
  created_at: string;
}
