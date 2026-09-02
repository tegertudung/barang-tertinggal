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

1. Buat project baru di [supabase.com](https://supabase.com). Saat membuat project, matikan opsi **"Automatically expose new tables"** (lebih aman — akses tabel akan diatur eksplisit lewat RLS + GRANT di `schema.sql`).
2. Salin `.env.local.example` menjadi `.env.local`, lalu isi dengan URL & Publishable/anon key project Anda (Project Settings → API Keys).
3. Jalankan [`docs/schema.sql`](docs/schema.sql) di Supabase **SQL Editor** — satu file ini sudah mencakup tabel, enum, trigger, RLS policy, GRANT, dan function `submit_claim`.
4. Buat dua bucket **Storage**: `barang-photos` (public) dan `bukti-serah-terima` (**bukan** public/private tetap default).
5. Jalankan [`docs/storage-policies.sql`](docs/storage-policies.sql) di SQL Editor (setelah kedua bucket di atas ada).
6. Buat akun petugas pertama lewat **Authentication → Users → Add user** (centang **Auto Confirm User**), salin User UID-nya, lalu jalankan di SQL Editor:
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
