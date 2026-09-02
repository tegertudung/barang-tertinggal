# Hasil Testing (Fase 13)

Checklist berikut mengacu pada brief poin 26 "Fase 13 — Testing". Semua
diuji manual di lingkungan development terhadap project Supabase nyata
(`barang-tertinggal`), sebagian oleh Claude lewat browser otomatis,
sebagian oleh pengguna langsung.

| # | Skenario | Status | Catatan |
|---|---|---|---|
| 1 | Pengunjung mencari barang | ✅ Lulus | Search + filter kategori di `/` bekerja, hasil sesuai. |
| 2 | Pengunjung membuka detail | ✅ Lulus | `/barang/[id]` menampilkan info aman untuk publik, tanpa data sensitif. |
| 3 | Pengunjung mengajukan klaim | ✅ Lulus | Form di `/klaim/[id]` submit sukses, nomor klaim `CLM-2026-001` tampil sesuai contoh brief. |
| 4 | Petugas login | ✅ Lulus | Login sukses & gagal (pesan error) diuji, redirect ke `/dashboard`. |
| 5 | Petugas menambah barang | ✅ Lulus | Tambah barang + upload foto tersimpan & tampil di halaman publik. |
| 6 | Petugas mengedit barang | ✅ Lulus | Dikonfirmasi pengguna, perubahan tersimpan. |
| 7 | Petugas memproses klaim | ✅ Lulus | Klaim tampil di `/dashboard/klaim`, detail lengkap termasuk data privat pengklaim. |
| 8 | Petugas menyetujui/menolak klaim | ✅ Lulus | Setujui: status berubah, `items.status` ikut jadi `DIKLAIM`. Tolak: status jadi `DITOLAK`, `items.status` tetap `TERSIMPAN` (barang tetap bisa diklaim ulang). Keduanya diuji end-to-end. |
| 9 | Petugas mengambil foto | ✅ Lulus | Kamera (`getUserMedia`) dikonfirmasi pengguna: buka kamera, ambil foto, ambil ulang, semua bekerja. |
| 10 | Pengembalian berhasil disimpan | ✅ Lulus | Record `returns` tersimpan, muncul di Riwayat Pengembalian. |
| 11 | Status barang berubah | ✅ Lulus | `items.status` → `DIKEMBALIKAN`, `claims.status` → `SELESAI` terkonfirmasi. |
| 12 | Data tidak dapat diakses pihak tak berwenang | ✅ Lulus | Diuji langsung lewat REST API dengan anon key: `claims` & `returns` → 401 permission denied; foto bukti serah terima → 404 (disamarkan, bukan sekadar ditolak). `items` (publik) tetap bisa dibaca sesuai desain. |

## Bug yang ditemukan & diperbaiki selama testing

1. **RLS tanpa GRANT dasar** — tabel dibuat dengan "Automatically expose new
   tables" nonaktif, sehingga `anon`/`authenticated` tidak punya hak akses
   dasar walau RLS policy benar → diperbaiki dengan `docs/grants.sql`.
2. **Klaim publik butuh baca balik nomor klaim** — insert biasa butuh hak
   SELECT yang seharusnya tidak diberikan ke publik → diganti pakai
   database function `submit_claim` (`SECURITY DEFINER`) yang hanya
   mengembalikan nomor urut & tanggal, tanpa expose isi tabel `claims`.
3. **next.config belum menerima domain signed URL Storage** — pathname
   remotePattern diperluas dari `/object/public/**` ke `/object/**`.
4. **Laporan salah hitung "Klaim Disetujui"** — klaim yang sudah lanjut ke
   `SELESAI` tidak lagi berstatus `DISETUJUI`, sehingga tidak terhitung.
   Diperbaiki: `DISETUJUI` dan `SELESAI` sama-sama dihitung sebagai
   "pernah disetujui".

Update: skenario "Tolak Klaim" sudah diuji juga (klaim tes `CLM-2026-002`
pada barang `BLG-2026-TEST`) — status klaim berubah jadi `DITOLAK`, dan
`items.status` barang tsb tetap `TERSIMPAN` (tidak ikut berubah), sesuai
desain supaya barang masih bisa dicari & diklaim ulang oleh pemilik asli.

## Belum diuji otomatis (perlu dicoba manual berkala)

- Perilaku di berbagai browser/perangkat mobile sungguhan untuk kamera
  (`getUserMedia` butuh HTTPS di luar `localhost`).
