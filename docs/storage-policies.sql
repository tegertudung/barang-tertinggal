-- =========================================================
-- Storage policies untuk bucket barang-photos & bukti-serah-terima
-- Jalankan di Supabase SQL Editor setelah kedua bucket dibuat.
-- =========================================================

-- barang-photos: publik boleh lihat (bucket sudah public, tapi tetap
-- perlu policy select eksplisit), hanya petugas login yang boleh upload/hapus.
create policy "barang_photos_select_public"
  on storage.objects for select
  using (bucket_id = 'barang-photos');

create policy "barang_photos_insert_staff"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'barang-photos');

create policy "barang_photos_update_staff"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'barang-photos');

create policy "barang_photos_delete_staff"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'barang-photos');

-- bukti-serah-terima: privat, hanya petugas login yang boleh
-- lihat/upload/hapus. Publik tidak diberi policy apa pun (default: ditolak).
create policy "bukti_serah_terima_all_staff"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'bukti-serah-terima')
  with check (bucket_id = 'bukti-serah-terima');
