-- =========================================================
-- Function submit_claim: menerima pengajuan klaim dari publik.
-- Dipakai lewat RPC supaya publik TIDAK perlu diberi hak SELECT
-- langsung ke tabel `claims` (mencegah pengunjung membaca data
-- pengklaim lain), tapi tetap bisa menerima nomor klaim hasil insert.
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

-- Insert langsung ke tabel claims oleh publik tidak lagi diperlukan
-- (semua lewat function di atas), jadi policy insert publik bisa dicabut.
drop policy if exists "claims_insert_public" on claims;
revoke insert on claims from anon;
