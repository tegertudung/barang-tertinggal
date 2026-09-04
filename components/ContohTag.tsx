/**
 * Tag kecil untuk menandai angka/data yang belum tersedia di sistem
 * (mis. kapasitas loker fisik, NIP, shift) sehingga ditampilkan
 * sebagai contoh -- BUKAN data sungguhan -- sesuai layout mockup.
 */
export function ContohTag() {
  return (
    <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
      Contoh
    </span>
  );
}
