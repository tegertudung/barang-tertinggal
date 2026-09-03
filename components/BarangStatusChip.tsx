const STYLE: Record<string, string> = {
  TERSIMPAN: "bg-emerald-100 text-emerald-800 border-emerald-300",
  DIKLAIM: "bg-amber-100 text-amber-800 border-amber-300",
  DIKEMBALIKAN: "bg-slate-100 text-slate-700 border-slate-300",
};

const LABEL: Record<string, string> = {
  TERSIMPAN: "Tersimpan",
  DIKLAIM: "Dalam Verifikasi",
  DIKEMBALIKAN: "Telah Dikembalikan",
};

const DOT: Record<string, string> = {
  TERSIMPAN: "bg-emerald-600",
  DIKLAIM: "bg-amber-600",
  DIKEMBALIKAN: "bg-slate-500",
};

/** Badge status barang bergaya Material 3 untuk halaman publik v2. */
export function BarangStatusChip({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        STYLE[status] ?? "bg-black/5 border-black/10 text-black/70"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status] ?? "bg-black/40"}`} />
      {LABEL[status] ?? status}
    </span>
  );
}
