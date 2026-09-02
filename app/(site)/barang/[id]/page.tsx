import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal, labelStatusBarang } from "@/lib/format";
import { getBarangFotoUrl } from "@/lib/storage";
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

  const fotoUrl = getBarangFotoUrl(item.foto);
  const bisaDiklaim = item.status === "TERSIMPAN";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        ← Kembali ke daftar barang
      </Link>

      <div className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
        <div className="relative aspect-video w-full bg-black/5 dark:bg-white/10">
          {fotoUrl ? (
            <Image
              src={fotoUrl}
              alt={item.nama_barang}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">
              📦
            </div>
          )}
        </div>

        <div className="space-y-4 p-6">
          <div>
            <h1 className="text-2xl font-bold">{item.nama_barang}</h1>
            <p className="text-sm text-black/60 dark:text-white/60">
              Kode: {item.kode_barang}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Detail label="Kategori" value={item.kategori} />
            <Detail label="Warna" value={item.warna || "-"} />
            <Detail
              label="Lokasi Ditemukan"
              value={item.lokasi_ditemukan}
            />
            <Detail
              label="Tanggal Ditemukan"
              value={formatTanggal(item.tanggal_ditemukan)}
            />
            <Detail label="Status" value={labelStatusBarang(item.status)} />
          </dl>

          {item.deskripsi && (
            <div>
              <h2 className="text-sm font-semibold text-black/60 dark:text-white/60">
                Deskripsi
              </h2>
              <p className="mt-1 text-sm">{item.deskripsi}</p>
            </div>
          )}

          <div className="border-t border-black/10 pt-4 dark:border-white/10">
            {bisaDiklaim ? (
              <Link
                href={`/klaim/${item.id}`}
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 sm:w-auto"
              >
                Saya Pemilik Barang Ini
              </Link>
            ) : (
              <p className="rounded-md bg-black/5 px-4 py-2.5 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
                Barang ini sudah tidak dapat diklaim (status:{" "}
                {labelStatusBarang(item.status)}).
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-black/50 dark:text-white/50">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
