import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { KlaimForm } from "@/components/KlaimForm";
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
      <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
        <Link
          href={`/barang/${item.id}`}
          className="mb-5 inline-block text-sm font-medium text-brand-primary hover:underline"
        >
          ← Kembali ke detail barang
        </Link>

        <h1 className="mb-5 text-xl font-bold tracking-tight">
          Form Pengajuan Klaim
        </h1>

        {item.status !== "TERSIMPAN" ? (
          <p className="rounded-lg border border-black/10 p-4 text-sm text-black/60">
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
