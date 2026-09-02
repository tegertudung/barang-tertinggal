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
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <Link
        href={`/barang/${item.id}`}
        className="mb-4 inline-block text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        ← Kembali ke detail barang
      </Link>

      <h1 className="mb-1 text-xl font-bold">Form Pengajuan Klaim</h1>
      <p className="mb-6 text-sm text-black/60 dark:text-white/60">
        Untuk: <span className="font-medium">{item.nama_barang}</span> (
        {item.kode_barang})
      </p>

      {item.status !== "TERSIMPAN" ? (
        <p className="rounded-md border border-black/10 p-4 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
          Barang ini sudah tidak dapat diklaim.
        </p>
      ) : (
        <KlaimForm itemId={item.id} />
      )}
    </main>
  );
}
