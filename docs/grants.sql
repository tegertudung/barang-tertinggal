-- =========================================================
-- Grant akses tabel untuk role anon & authenticated.
-- Diperlukan karena "Automatically expose new tables" dimatikan
-- saat membuat project (praktik yang lebih aman), sehingga GRANT
-- dasar perlu diberikan manual. RLS policy tetap yang membatasi
-- baris mana yang boleh diakses.
-- =========================================================

grant usage on schema public to anon, authenticated;

-- items: publik boleh baca, petugas (authenticated) boleh CRUD penuh
grant select on items to anon, authenticated;
grant insert, update, delete on items to authenticated;

-- claims: publik boleh insert (ajukan klaim), petugas boleh baca & update
grant insert on claims to anon, authenticated;
grant select, update on claims to authenticated;

-- returns: hanya petugas
grant select, insert, update, delete on returns to authenticated;

-- profiles: hanya petugas (baca profil sendiri, diatur RLS)
grant select on profiles to authenticated;
