import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { KlaimForm } from "@/components/KlaimForm";
import { Icon } from "@/components/Icon";
import type { Item } from "@/types/database";

export const revalidate = 0;

export default async function PengajuanKlaimPage({
  params,
}: PageProps<"/klaim/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle<Item>();

  if (!item) notFound();

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
      <div className="rounded-2xl border border-m3-outline-variant/50 bg-m3-surface-container-lowest p-4 shadow-sm sm:p-6">
        <Link
          href={`/barang/${item.id}`}
          className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-m3-primary hover:underline"
        >
          <Icon name="arrow_back" className="!text-[16px]" />
          Kembali ke detail barang
        </Link>

        <h1 className="mb-5 text-xl font-bold tracking-tight text-m3-on-surface">
          Form Pengajuan Klaim
        </h1>

        {item.status !== "TERSIMPAN" ? (
          <p className="rounded-lg border border-m3-outline-variant/40 p-4 text-sm text-m3-on-surface-variant">
            Barang ini sudah tidak dapat diklaim.
          </p>
        ) : (
          <KlaimForm
            itemId={item.id}
            namaBarang={item.nama_barang}
            lokasi={item.lokasi_ditemukan}
            kategori={item.kategori}
          />
        )}
      </div>
    </main>
  );
}
