import { BarangForm } from "@/components/BarangForm";
import { createItem } from "@/lib/actions/barang";

export default function TambahBarangPage() {
  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">Tambah Barang</h1>
      <p className="mb-6 text-sm text-black/60">
        Catat barang tertinggal yang baru ditemukan.
      </p>
      <BarangForm action={createItem} />
    </div>
  );
}
