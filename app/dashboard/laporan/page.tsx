import { createClient } from "@/lib/supabase/server";
import { KATEGORI_LIST } from "@/lib/categories";

export const revalidate = 0;

function ambil(params: Record<string, string | string[] | undefined>, key: string) {
  const v = params[key];
  return typeof v === "string" ? v : "";
}

export default async function LaporanPage({
  searchParams,
}: PageProps<"/dashboard/laporan">) {
  const params = await searchParams;
  const dari = ambil(params, "dari");
  const sampai = ambil(params, "sampai");
  const kategori = ambil(params, "kategori");
  const status = ambil(params, "status");
  const lokasi = ambil(params, "lokasi");

  const supabase = await createClient();

  let itemQuery = supabase
    .from("items")
    .select("id, status")
    .order("tanggal_ditemukan", { ascending: false });

  if (dari) itemQuery = itemQuery.gte("tanggal_ditemukan", dari);
  if (sampai) itemQuery = itemQuery.lte("tanggal_ditemukan", sampai);
  if (kategori) itemQuery = itemQuery.eq("kategori", kategori);
  if (status) itemQuery = itemQuery.eq("status", status);
  if (lokasi) itemQuery = itemQuery.ilike("lokasi_ditemukan", `%${lokasi}%`);

  const { data: items, error } = await itemQuery;
  const itemList = items ?? [];
  const itemIds = itemList.map((i) => i.id);

  let klaimDisetujui = 0;
  let klaimDitolak = 0;

  if (itemIds.length > 0) {
    const { data: claims } = await supabase
      .from("claims")
      .select("status")
      .in("item_id", itemIds);

    for (const c of claims ?? []) {
      // SELESAI berarti klaim sempat disetujui lalu barangnya sudah
      // dikembalikan, jadi tetap dihitung sebagai "disetujui".
      if (c.status === "DISETUJUI" || c.status === "SELESAI") {
        klaimDisetujui++;
      }
      if (c.status === "DITOLAK") klaimDitolak++;
    }
  }

  const totalDitemukan = itemList.length;
  const masihTersimpan = itemList.filter((i) => i.status === "TERSIMPAN").length;
  const dikembalikan = itemList.filter((i) => i.status === "DIKEMBALIKAN").length;
  const pernahDiklaim = itemList.filter((i) => i.status !== "TERSIMPAN").length;

  const stats = [
    { label: "Barang Ditemukan", value: totalDitemukan, color: "bg-blue-600" },
    { label: "Barang Diklaim", value: pernahDiklaim, color: "bg-amber-500" },
    { label: "Klaim Disetujui", value: klaimDisetujui, color: "bg-green-600" },
    { label: "Klaim Ditolak", value: klaimDitolak, color: "bg-red-600" },
    { label: "Barang Dikembalikan", value: dikembalikan, color: "bg-purple-600" },
    { label: "Masih Tersimpan", value: masihTersimpan, color: "bg-slate-500" },
  ];

  const maxValue = Math.max(1, ...stats.map((s) => s.value));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Laporan Barang Tertinggal</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Statistik & riwayat berdasarkan filter periode, kategori, status,
          dan lokasi.
        </p>
      </div>

      <form
        className="mb-6 grid grid-cols-2 gap-3 rounded-lg border border-black/10 p-4 sm:grid-cols-3 md:grid-cols-5 dark:border-white/10"
        method="get"
      >
        <FilterField label="Dari Tanggal">
          <input type="date" name="dari" defaultValue={dari} className={inputClass} />
        </FilterField>
        <FilterField label="Sampai Tanggal">
          <input type="date" name="sampai" defaultValue={sampai} className={inputClass} />
        </FilterField>
        <FilterField label="Kategori">
          <select name="kategori" defaultValue={kategori} className={inputClass}>
            <option value="">Semua</option>
            {KATEGORI_LIST.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Status">
          <select name="status" defaultValue={status} className={inputClass}>
            <option value="">Semua</option>
            <option value="TERSIMPAN">Tersimpan</option>
            <option value="DIKLAIM">Diklaim</option>
            <option value="DIKEMBALIKAN">Dikembalikan</option>
          </select>
        </FilterField>
        <FilterField label="Lokasi Ditemukan">
          <input
            type="text"
            name="lokasi"
            defaultValue={lokasi}
            placeholder="mis. Ruang Baca"
            className={inputClass}
          />
        </FilterField>

        <div className="col-span-2 flex items-end gap-2 sm:col-span-3 md:col-span-5">
          <button
            type="submit"
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Terapkan Filter
          </button>
          <a
            href="/dashboard/laporan"
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Reset
          </a>
        </div>
      </form>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Gagal memuat laporan: {error.message}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-black/10 p-4 dark:border-white/10"
          >
            <p className="text-xs text-black/60 dark:text-white/60">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-black/10 p-4 dark:border-white/10">
        <h2 className="mb-4 text-sm font-semibold text-black/60 dark:text-white/60">
          Grafik Ringkasan
        </h2>
        <div className="space-y-3">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{s.label}</span>
                <span className="font-medium">{s.value}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className={`h-full rounded-full ${s.color}`}
                  style={{ width: `${(s.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-blue-600 dark:border-white/20 dark:bg-white/5";

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-black/60 dark:text-white/60">
        {label}
      </label>
      {children}
    </div>
  );
}
