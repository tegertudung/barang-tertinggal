# Sistem Informasi Barang Tertinggal

Website pengelolaan barang tertinggal untuk **Balai Perpustakaan DPAD DIY** — bagian Layanan dan Informasi.

Lihat rancangan lengkap di:
- [`docs/ALUR.md`](docs/ALUR.md) — use case & alur sistem
- [`docs/ROUTES.md`](docs/ROUTES.md) — struktur route
- [`docs/DATABASE.md`](docs/DATABASE.md) — ERD & schema SQL Supabase

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Storage).

## Status pengerjaan

- [x] Fase 1 — Setup Next.js + TypeScript + Tailwind + App Router
- [x] Fase 2 — Hubungkan project ke Supabase
- [x] Fase 3 — Buat tabel & RLS di Supabase
- [x] Fase 4 — Halaman publik (beranda, search, filter, detail)
- [x] Fase 5 — CRUD barang (petugas)
- [x] Fase 6 — Login petugas & proteksi route
- [x] Fase 7 — Dashboard
- [x] Fase 8 — Form & pengelolaan klaim
- [x] Fase 9 — Verifikasi klaim
- [x] Fase 10 — Proses pengembalian
- [x] Fase 11 — Kamera & bukti foto
- [x] Fase 12 — Laporan
- [x] Fase 13 — Testing (lihat [`docs/TESTING.md`](docs/TESTING.md))
- [ ] Fase 14 — Deployment (Vercel)

## Getting Started

### 1. Setup Supabase (Fase 2)

1. Buat project baru di [supabase.com](https://supabase.com).
2. Salin `.env.local.example` menjadi `.env.local`, lalu isi dengan URL & Publishable/anon key project Anda (Project Settings → API Keys).
3. Jalankan file SQL berikut di Supabase **SQL Editor**, berurutan:
   1. [`docs/schema.sql`](docs/schema.sql) — tabel, enum, trigger, RLS policy
   2. [`docs/grants.sql`](docs/grants.sql) — GRANT akses tabel untuk anon/authenticated
   3. [`docs/storage-policies.sql`](docs/storage-policies.sql) — policy storage (setelah bucket dibuat, langkah 4)
   4. [`docs/migration-nomor-klaim.sql`](docs/migration-nomor-klaim.sql) — kolom nomor urut klaim
   5. [`docs/migration-submit-claim-function.sql`](docs/migration-submit-claim-function.sql) — function `submit_claim`
4. Buat dua bucket Storage: `barang-photos` (public) dan `bukti-serah-terima` (private).
5. Buat akun petugas pertama lewat Supabase Auth (Authentication → Users → Add user, centang **Auto Confirm User**), lalu jalankan:
   ```sql
   insert into profiles (id, nama) values ('<UID user>', '<Nama Petugas>');
   ```

```bash
cp .env.local.example .env.local
```

### 2. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).
