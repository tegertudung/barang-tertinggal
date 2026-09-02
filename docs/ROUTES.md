# Struktur Route (App Router)

## Publik (tanpa login)

| Route | Deskripsi |
|---|---|
| `/` | Beranda: search, filter kategori, daftar barang |
| `/barang/[id]` | Detail barang (info aman untuk publik) |
| `/klaim/[id]` | Form pengajuan klaim untuk barang tsb |

## Petugas (wajib login)

| Route | Deskripsi |
|---|---|
| `/login` | Login petugas (Supabase Auth) |
| `/dashboard` | Ringkasan statistik + klaim terbaru |
| `/dashboard/barang` | Daftar barang (search, filter, edit, hapus) |
| `/dashboard/barang/tambah` | Form tambah barang |
| `/dashboard/barang/[id]/edit` | Form edit barang |
| `/dashboard/klaim` | Daftar seluruh klaim |
| `/dashboard/klaim/[id]` | Detail klaim + verifikasi (setujui/tolak) |
| `/dashboard/pengembalian` | Riwayat pengembalian |
| `/dashboard/pengembalian/[claim_id]` | Proses pengembalian (kamera + simpan) |
| `/dashboard/laporan` | Statistik & filter laporan |
| `/dashboard/profil` | Profil petugas |

`middleware.ts` melindungi semua `/dashboard/*` — redirect ke `/login` jika belum login, dan redirect ke `/dashboard` jika sudah login tapi membuka `/login`.
