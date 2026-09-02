# Use Case & Alur Sistem

## Use Case

**Aktor: Pengunjung (tanpa login)**
- Melihat daftar barang tertinggal
- Mencari & memfilter barang
- Melihat detail barang (info terbatas)
- Mengajukan klaim

**Aktor: Petugas (login, role tunggal `petugas`)**
- Login / logout
- CRUD data barang
- Melihat & memverifikasi klaim (setujui/tolak + catatan)
- Memproses pengembalian (ambil foto bukti, simpan)
- Melihat riwayat pengembalian
- Melihat laporan/statistik

## Alur utama

```text
Barang ditemukan
  → Petugas mencatat barang (status: TERSIMPAN)
  → Tampil di halaman publik
  → Pengunjung cari & lihat detail
  → Pengunjung ajukan klaim (claims.status: MENUNGGU)
  → Petugas verifikasi
      → tidak cocok → claims.status: DITOLAK
      → cocok       → claims.status: DISETUJUI
                        (items.status bisa diset DIKLAIM sebagai penanda proses)
  → Pengunjung datang mengambil barang
  → Petugas buka /dashboard/pengembalian/[claim_id]
  → Ambil foto bukti serah terima (getUserMedia) → upload ke Storage privat
  → Simpan pengembalian → insert record `returns`
  → claims.status → SELESAI
  → items.status  → DIKEMBALIKAN
```

Klaim disetujui **tidak otomatis** berarti barang sudah dikembalikan — dua proses terpisah (`claims` vs `returns`), sesuai brief.

## Status

- `items.status`: `TERSIMPAN` → `DIKLAIM` (opsional, saat klaim disetujui) → `DIKEMBALIKAN`
- `claims.status`: `MENUNGGU` → `DISETUJUI` / `DITOLAK` → (jika disetujui) `SELESAI` setelah pengembalian tercatat
