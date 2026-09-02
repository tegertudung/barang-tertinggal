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
- [ ] Fase 2 — Hubungkan project ke Supabase (butuh project Supabase milik Anda)
- [ ] Fase 3 — Buat tabel & RLS di Supabase (SQL sudah disiapkan di `docs/DATABASE.md`)
- [ ] Fase 4 — Halaman publik (beranda, search, filter, detail)
- [ ] Fase 5 — CRUD barang (petugas)
- [ ] Fase 6 — Login petugas & proteksi route
- [ ] Fase 7 — Dashboard
- [ ] Fase 8 — Form & pengelolaan klaim
- [ ] Fase 9 — Verifikasi klaim
- [ ] Fase 10 — Proses pengembalian
- [ ] Fase 11 — Kamera & bukti foto
- [ ] Fase 12 — Laporan
- [ ] Fase 13 — Testing
- [ ] Fase 14 — Deployment (Vercel)

## Getting Started

### 1. Setup Supabase (Fase 2)

1. Buat project baru di [supabase.com](https://supabase.com).
2. Salin `.env.local.example` menjadi `.env.local`, lalu isi dengan URL & anon key project Anda (Project Settings → API).
3. Jalankan SQL pada [`docs/DATABASE.md`](docs/DATABASE.md) di Supabase SQL Editor untuk membuat tabel, enum, trigger, dan RLS policy.
4. Buat dua bucket Storage: `barang-photos` (public) dan `bukti-serah-terima` (private).
5. Buat akun petugas pertama lewat Supabase Auth (Authentication → Users → Add user), lalu tambahkan row-nya ke tabel `profiles`.

```bash
cp .env.local.example .env.local
```

### 2. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).
