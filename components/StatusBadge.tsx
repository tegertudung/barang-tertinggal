import { labelStatusBarang, labelStatusKlaim } from "@/lib/format";

const KLAIM_STYLE: Record<string, string> = {
  MENUNGGU: "bg-blue-50 text-blue-700",
  DISETUJUI: "bg-green-50 text-green-700",
  DITOLAK: "bg-red-50 text-red-700",
  SELESAI: "bg-slate-100 text-slate-600",
};

const BARANG_STYLE: Record<string, string> = {
  TERSIMPAN: "bg-green-50 text-green-700",
  DIKLAIM: "bg-amber-50 text-amber-700",
  DIKEMBALIKAN: "bg-slate-100 text-slate-600",
};

export function KlaimStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        KLAIM_STYLE[status] ?? "bg-black/5"
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
        BARANG_STYLE[status] ?? "bg-black/5"
      }`}
    >
      {labelStatusBarang(status)}
    </span>
  );
}
