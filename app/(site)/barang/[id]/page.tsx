import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/format";
import { IconInfo, IconLock } from "@/components/icons";
import { BarangStatusBadge } from "@/components/StatusBadge";
import type { Item } from "@/types/database";

export const revalidate = 0;

export default async function DetailBarangPage({
  params,
}: PageProps<"/barang/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle<Item>();

  if (!item) notFound();

  const bisaDiklaim = item.status === "TERSIMPAN";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
        <Link
          href="/"
          className="mb-5 inline-block text-sm font-medium text-brand-primary hover:underline"
        >
          ← Kembali ke Daftar
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="pattern-diagonal flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl p-8 text-center md:aspect-auto">
            <IconLock className="h-7 w-7 text-black/30" />
            <p className="max-w-[220px] text-sm text-black/45">
              Foto tidak ditampilkan untuk menjaga keamanan barang
            </p>
          </div>

          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-black/70">
                {item.kategori}
              </span>
              <BarangStatusBadge status={item.status} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              {item.nama_barang}
            </h1>

            <dl className="mt-5 divide-y divide-black/10 border-y border-black/10">
              {item.warna && <DetailRow label="Warna" value={item.warna} />}
              <DetailRow
                label="Lokasi Ditemukan"
                value={item.lokasi_ditemukan}
                valueClass="text-brand-primary"
              />
              <DetailRow
                label="Tanggal Ditemukan"
                value={formatTanggal(item.tanggal_ditemukan)}
                valueClass="text-brand-accent"
              />
            </dl>

            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <IconInfo className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Detail lengkap barang hanya dapat diverifikasi langsung oleh
                petugas saat proses pengambilan.
              </span>
            </div>

            <div className="mt-6">
              {bisaDiklaim ? (
                <Link
                  href={`/klaim/${item.id}`}
                  className="flex w-full items-center justify-center rounded-lg bg-brand-accent px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  Saya Pemilik Barang Ini
                </Link>
              ) : (
                <p className="rounded-lg bg-black/5 px-4 py-3 text-center text-sm text-black/60">
                  Barang ini sudah tidak dapat diklaim.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
        {label}
      </dt>
      <dd className={`text-sm font-semibold ${valueClass ?? "text-black/80"}`}>
        {value}
      </dd>
    </div>
  );
}
