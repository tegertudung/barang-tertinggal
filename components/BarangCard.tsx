import Link from "next/link";
import type { Item } from "@/types/database";
import { formatTanggal } from "@/lib/format";
import { renderKategoriIcon } from "@/lib/categories";
import { IconCalendar, IconPin } from "@/components/icons";
import { BarangStatusBadge } from "@/components/StatusBadge";

export function BarangCard({ item }: { item: Item }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="pattern-diagonal relative flex aspect-[4/3] w-full items-center justify-center">
        {renderKategoriIcon(item.kategori, "h-10 w-10 text-brand-primary/25")}
        <div className="absolute right-2 top-2">
          <BarangStatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-snug">{item.nama_barang}</h3>

        <div className="space-y-1 text-sm text-black/60">
          <p className="flex items-center gap-1.5">
            <IconPin className="h-3.5 w-3.5 shrink-0 text-black/40" />
            {item.lokasi_ditemukan}
          </p>
          <p className="flex items-center gap-1.5">
            <IconCalendar className="h-3.5 w-3.5 shrink-0 text-black/40" />
            {formatTanggal(item.tanggal_ditemukan)}
          </p>
        </div>

        <Link
          href={`/barang/${item.id}`}
          className="mt-2 inline-flex items-center justify-center rounded-md border border-brand-accent px-3 py-2 text-sm font-semibold text-brand-accent hover:bg-brand-accent/5"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
