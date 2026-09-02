import { labelStatusBarang, labelStatusKlaim } from "@/lib/format";

const KLAIM_STYLE: Record<string, string> = {
  MENUNGGU: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  DISETUJUI: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  DITOLAK: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  SELESAI: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60",
};

const BARANG_STYLE: Record<string, string> = {
  TERSIMPAN: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  DIKLAIM: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  DIKEMBALIKAN: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60",
};

export function KlaimStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        KLAIM_STYLE[status] ?? "bg-black/5 dark:bg-white/10"
      }`}
    >
      {labelStatusKlaim(status)}
    </span>
  );
}

export function BarangStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        BARANG_STYLE[status] ?? "bg-black/5 dark:bg-white/10"
      }`}
    >
      {labelStatusBarang(status)}
    </span>
  );
}
