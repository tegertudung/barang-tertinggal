-- =========================================================
-- Sistem Informasi Barang Tertinggal — Schema Supabase
-- Versi konsolidasi: sudah termasuk seluruh migration susulan
-- (nomor urut klaim, function submit_claim, grants).
-- Jalankan seluruh file ini sekali di Supabase SQL Editor pada
-- project BARU. Untuk project yang sudah pernah menjalankan versi
-- lama file ini + migration-*.sql secara terpisah, TIDAK PERLU
-- dijalankan ulang (sudah setara).
-- =========================================================

-- Enum status
create type item_status as enum ('TERSIMPAN', 'DIKLAIM', 'DIKEMBALIKAN');
create type claim_status as enum ('MENUNGGU', 'DISETUJUI', 'DITOLAK', 'SELESAI');

-- Tabel profiles (data tambahan petugas, id = auth.users.id)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  status text not null default 'aktif',
  created_at timestamptz not null default now()
);

-- Tabel items
create table items (
  id uuid primary key default gen_random_uuid(),
  kode_barang text not null unique,
  nama_barang text not null,
  kategori text not null,
  warna text,
  deskripsi text,
  lokasi_ditemukan text not null,
  tanggal_ditemukan date not null,
  foto text,
  status item_status not null default 'TERSIMPAN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_items_status on items(status);
create index idx_items_kategori on items(kategori);

-- Tabel claims
-- nomor_urut: dasar pembentukan nomor klaim tampilan (CLM-<tahun>-<3
-- digit>), lihat types/database.ts -> formatNomorKlaim().
create table claims (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  nama_pengklaim text not null,
  no_hp text not null,
  waktu_kehilangan text,
  lokasi_kehilangan text,
  ciri_barang text not null,
  keterangan text,
  status claim_status not null default 'MENUNGGU',
  catatan_petugas text,
  nomor_urut serial,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_claims_item_id on claims(item_id);
create index idx_claims_status on claims(status);

-- Tabel returns
create table returns (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null unique references claims(id) on delete restrict,
  petugas_id uuid not null references profiles(id),
  tanggal_pengembalian timestamptz not null default now(),
  foto_serah_terima text,
  catatan text,
  created_at timestamptz not null default now()
);

-- Trigger updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_items_updated_at before update on items
  for each row execute function set_updated_at();

create trigger trg_claims_updated_at before update on claims
  for each row execute function set_updated_at();

-- Row Level Security
alter table profiles enable row level security;
alter table items enable row level security;
alter table claims enable row level security;
alter table returns enable row level security;

-- profiles: petugas hanya bisa melihat profil sendiri
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

-- items: publik boleh baca semua, petugas boleh CRUD
create policy "items_select_public" on items
  for select using (true);

create policy "items_write_staff" on items
  for insert to authenticated with check (true);
create policy "items_update_staff" on items
  for update to authenticated using (true);
create policy "items_delete_staff" on items
  for delete to authenticated using (true);

-- claims: publik TIDAK diberi policy insert/select langsung.
-- Pengajuan klaim publik lewat function submit_claim() di bawah
-- (SECURITY DEFINER), supaya publik tidak perlu hak SELECT ke tabel
-- claims (mencegah pengunjung membaca data pengklaim lain).
create policy "claims_select_staff" on claims
  for select to authenticated using (true);
create policy "claims_update_staff" on claims
  for update to authenticated using (true);

-- returns: hanya petugas yang login yang boleh akses
create policy "returns_all_staff" on returns
  for all to authenticated using (true) with check (true);

-- =========================================================
-- GRANT akses tabel untuk anon & authenticated.
-- Diperlukan kalau opsi "Automatically expose new tables" dimatikan
-- saat membuat project (rekomendasi kami, lebih aman) — RLS policy
-- di atas membatasi baris, tapi role tetap butuh GRANT dasar dulu.
-- =========================================================
grant usage on schema public to anon, authenticated;

grant select on items to anon, authenticated;
grant insert, update, delete on items to authenticated;

grant select, update on claims to authenticated;

grant select, insert, update, delete on returns to authenticated;

grant select on profiles to authenticated;

-- =========================================================
-- Function submit_claim: satu-satunya jalur publik untuk mengajukan
-- klaim. SECURITY DEFINER supaya bisa insert ke claims & baca status
-- items tanpa publik perlu diberi GRANT langsung ke tabel tsb.
-- =========================================================
create or replace function submit_claim(
  p_item_id uuid,
  p_nama_pengklaim text,
  p_no_hp text,
  p_waktu_kehilangan text,
  p_lokasi_kehilangan text,
  p_ciri_barang text,
  p_keterangan text
)
returns table(nomor_urut int, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status item_status;
begin
  select status into v_status from items where id = p_item_id;

  if v_status is null then
    raise exception 'Barang tidak ditemukan.';
  end if;

  if v_status <> 'TERSIMPAN' then
    raise exception 'Barang ini sudah tidak dapat diklaim.';
  end if;

  return query
  insert into claims (
    item_id, nama_pengklaim, no_hp, waktu_kehilangan,
    lokasi_kehilangan, ciri_barang, keterangan, status
  )
  values (
    p_item_id, p_nama_pengklaim, p_no_hp, p_waktu_kehilangan,
    p_lokasi_kehilangan, p_ciri_barang, p_keterangan, 'MENUNGGU'
  )
  returning claims.nomor_urut, claims.created_at;
end;
$$;

grant execute on function submit_claim(uuid, text, text, text, text, text, text)
  to anon, authenticated;
