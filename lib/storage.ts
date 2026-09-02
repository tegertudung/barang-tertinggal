/**
 * items.foto menyimpan *path* di bucket `barang-photos` (bukan URL penuh),
 * supaya bucket/domain bisa berubah tanpa perlu migrasi data.
 * Helper ini mengubah path tsb menjadi public URL untuk ditampilkan.
 *
 * Dibuat sebagai string join manual (bukan lewat Supabase client) supaya
 * aman dipakai di Server maupun Client Component.
 */
export function getBarangFotoUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  return `${base}/storage/v1/object/public/barang-photos/${path}`;
}
