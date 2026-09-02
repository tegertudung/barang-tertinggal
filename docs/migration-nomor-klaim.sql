-- Tambahan kolom nomor urut otomatis untuk membentuk nomor klaim
-- (format tampilan: CLM-<tahun>-<nomor_urut 3 digit>, mis. CLM-2026-001)
alter table claims add column nomor_urut serial;
