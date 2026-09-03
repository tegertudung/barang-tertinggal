import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { BarangStatusChip } from "@/components/BarangStatusChip";
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
      <div className="rounded-2xl border border-m3-outline-variant/50 bg-m3-surface-container-lowest p-4 shadow-sm sm:p-6">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-m3-primary hover:underline"
        >
          <Icon name="arrow_back" className="!text-[16px]" />
          Kembali ke Daftar
        </Link>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="pattern-diagonal flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl p-8 text-center md:aspect-auto">
            <Icon name="lock" className="!text-[28px] text-m3-on-surface-variant/50" />
            <p className="max-w-[220px] text-sm text-m3-on-surface-variant">
              Foto tidak ditampilkan untuk menjaga keamanan barang
            </p>
          </div>

          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-m3-surface-container px-2.5 py-1 text-xs font-medium text-m3-on-surface-variant">
                {item.kategori}
              </span>
              <BarangStatusChip status={item.status} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-m3-on-surface">
              {item.nama_barang}
            </h1>

            <dl className="mt-5 divide-y divide-m3-outline-variant/30 border-y border-m3-outline-variant/30">
              {item.warna && <DetailRow label="Warna" value={item.warna} />}
              <DetailRow
                label="Lokasi Ditemukan"
                value={item.lokasi_ditemukan}
                valueClass="text-m3-primary"
              />
              <DetailRow
                label="Tanggal Ditemukan"
                value={formatTanggal(item.tanggal_ditemukan)}
                valueClass="text-m3-secondary"
              />
            </dl>

            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <Icon name="info" className="mt-0.5 !text-[18px] shrink-0" />
              <span>
                Detail lengkap barang hanya dapat diverifikasi langsung oleh
                petugas saat proses pengambilan.
              </span>
            </div>

            <div className="mt-6">
              {bisaDiklaim ? (
                <Link
                  href={`/klaim/${item.id}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-m3-secondary-container px-4 py-3 text-sm font-semibold text-m3-on-secondary-container shadow-xs hover:bg-m3-secondary hover:text-white"
                >
                  <Icon name="verified" className="!text-[18px]" />
                  Saya Pemilik Barang Ini
                </Link>
              ) : (
                <p className="rounded-lg bg-m3-surface-container px-4 py-3 text-center text-sm text-m3-on-surface-variant">
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
      <dt className="text-xs font-medium uppercase tracking-wide text-m3-on-surface-variant">
        {label}
      </dt>
      <dd className={`text-sm font-semibold ${valueClass ?? "text-m3-on-surface"}`}>
        {value}
      </dd>
    </div>
  );
}
