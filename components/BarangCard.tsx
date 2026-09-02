import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/types/database";
import { formatTanggal, labelStatusBarang } from "@/lib/format";
import { getBarangFotoUrl } from "@/lib/storage";

export function BarangCard({ item }: { item: Item }) {
  const fotoUrl = getBarangFotoUrl(item.foto);

  return (
    <Link
      href={`/barang/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
    >
      <div className="relative aspect-[4/3] w-full bg-black/5 dark:bg-white/10">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={item.nama_barang}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl">
            📦
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          {labelStatusBarang(item.status)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-semibold group-hover:underline">
          {item.nama_barang}
        </h3>
        <p className="text-sm text-black/60 dark:text-white/60">
          Ditemukan di {item.lokasi_ditemukan}
        </p>
        <p className="text-xs text-black/50 dark:text-white/50">
          {formatTanggal(item.tanggal_ditemukan)}
        </p>
      </div>
    </Link>
  );
}
