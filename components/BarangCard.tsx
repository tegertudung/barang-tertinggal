import Link from "next/link";
import type { Item } from "@/types/database";
import { formatTanggal } from "@/lib/format";
import { renderKategoriIcon } from "@/lib/categories";
import { Icon } from "@/components/Icon";
import { BarangStatusChip } from "@/components/BarangStatusChip";

const CORNER_TAG: Record<string, string> = {
  TERSIMPAN: "SECURE",
  DIKLAIM: "REVIEW",
  DIKEMBALIKAN: "CLOSED",
};

export function BarangCard({ item }: { item: Item }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-m3-outline-variant/50 bg-m3-surface-container-lowest transition-all duration-200 hover:-translate-y-1 hover:border-m3-primary-container hover:shadow-md">
      <div className="relative flex aspect-[16/10] flex-col items-center justify-center border-b border-m3-outline-variant/30 bg-m3-surface-container-low p-4 text-center">
        <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-m3-surface-container-lowest text-m3-primary shadow-xs">
          {renderKategoriIcon(item.kategori, "!text-[24px]")}
        </span>
        <span className="text-xs font-medium text-m3-on-surface-variant">
          Foto dilindungi untuk verifikasi kepemilikan
        </span>
        <span className="absolute bottom-2 right-2.5 rounded bg-m3-surface-container-lowest/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-m3-primary/80">
          DPAD DIY • {CORNER_TAG[item.status] ?? ""}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-medium text-m3-on-surface-variant">
              {item.kode_barang}
            </span>
            <BarangStatusChip status={item.status} />
          </div>

          <h3 className="line-clamp-1 font-bold text-m3-on-surface transition-colors group-hover:text-m3-primary">
            {item.nama_barang}
          </h3>

          <div className="mt-2 space-y-1.5 text-sm text-m3-on-surface-variant">
            <div className="flex items-start gap-2">
              <Icon name="location_on" className="mt-0.5 !text-[16px] shrink-0 text-m3-secondary" />
              <span>{item.lokasi_ditemukan}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="schedule" className="!text-[16px] shrink-0" />
              <span>{formatTanggal(item.tanggal_ditemukan)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-m3-outline-variant/30 pt-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-m3-secondary">
            <Icon name="sell" className="!text-[14px]" />
            {item.kategori}
          </span>
          <Link
            href={`/barang/${item.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-m3-primary-container px-3 py-1.5 text-sm font-semibold text-m3-primary-container transition-colors hover:bg-m3-primary-container hover:text-m3-on-primary"
          >
            Lihat Detail
            <Icon name="arrow_forward" className="!text-[14px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
