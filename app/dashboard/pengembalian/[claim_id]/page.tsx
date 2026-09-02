import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PengembalianForm } from "@/components/PengembalianForm";
import { formatTanggalWaktu } from "@/lib/format";
import type { Claim, Item, Return } from "@/types/database";
import { formatNomorKlaim } from "@/types/database";

export const revalidate = 0;

export default async function ProsesPengembalianPage({
  params,
}: PageProps<"/dashboard/pengembalian/[claim_id]">) {
  const { claim_id } = await params;
  const supabase = await createClient();

  const { data: klaim } = await supabase
    .from("claims")
    .select("*")
    .eq("id", claim_id)
    .maybeSingle<Claim>();

  if (!klaim) notFound();

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", klaim.item_id)
    .maybeSingle<Item>();

  if (!item) notFound();

  if (klaim.status === "SELESAI") {
    const { data: returnRecord } = await supabase
      .from("returns")
      .select("*")
      .eq("claim_id", klaim.id)
      .maybeSingle<Return>();

    let signedUrl: string | null = null;
    if (returnRecord?.foto_serah_terima) {
      const { data } = await supabase.storage
        .from("bukti-serah-terima")
        .createSignedUrl(returnRecord.foto_serah_terima, 60 * 10);
      signedUrl = data?.signedUrl ?? null;
    }

    return (
      <div className="max-w-lg">
        <Link
          href="/dashboard/pengembalian"
          className="mb-4 inline-block text-sm text-blue-700 hover:underline dark:text-blue-400"
        >
          ← Kembali ke riwayat pengembalian
        </Link>

        <h1 className="mb-1 text-xl font-bold">Pengembalian Selesai</h1>
        <p className="mb-6 text-sm text-black/60 dark:text-white/60">
          Klaim #{formatNomorKlaim(klaim)} — {item.nama_barang}
        </p>

        <div className="space-y-4 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
          <div>
            <p className="text-black/50 dark:text-white/50">Pengklaim</p>
            <p className="font-medium">{klaim.nama_pengklaim}</p>
          </div>
          {returnRecord && (
            <div>
              <p className="text-black/50 dark:text-white/50">
                Tanggal Pengembalian
              </p>
              <p className="font-medium">
                {formatTanggalWaktu(returnRecord.tanggal_pengembalian)}
              </p>
            </div>
          )}
          {returnRecord?.catatan && (
            <div>
              <p className="text-black/50 dark:text-white/50">Catatan</p>
              <p>{returnRecord.catatan}</p>
            </div>
          )}
          <div>
            <p className="mb-2 text-black/50 dark:text-white/50">
              Foto Bukti Serah Terima
            </p>
            {signedUrl ? (
              <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-md border border-black/10 dark:border-white/10">
                <Image
                  src={signedUrl}
                  alt="Bukti serah terima"
                  fill
                  sizes="384px"
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="text-black/50 dark:text-white/50">
                Foto tidak tersedia.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (klaim.status !== "DISETUJUI") {
    return (
      <div className="max-w-lg">
        <Link
          href={`/dashboard/klaim/${klaim.id}`}
          className="mb-4 inline-block text-sm text-blue-700 hover:underline dark:text-blue-400"
        >
          ← Kembali ke detail klaim
        </Link>
        <p className="rounded-md border border-black/10 p-4 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
          Klaim ini belum/tidak dalam status siap dikembalikan (status saat
          ini: {klaim.status}).
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <Link
        href={`/dashboard/klaim/${klaim.id}`}
        className="mb-4 inline-block text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        ← Kembali ke detail klaim
      </Link>

      <h1 className="mb-1 text-xl font-bold">Pengembalian Barang</h1>
      <p className="mb-6 text-sm text-black/60 dark:text-white/60">
        Klaim #{formatNomorKlaim(klaim)}
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <div>
          <p className="text-black/50 dark:text-white/50">Kode Barang</p>
          <p className="font-medium">{item.kode_barang}</p>
        </div>
        <div>
          <p className="text-black/50 dark:text-white/50">Barang</p>
          <p className="font-medium">{item.nama_barang}</p>
        </div>
        <div>
          <p className="text-black/50 dark:text-white/50">Pengklaim</p>
          <p className="font-medium">{klaim.nama_pengklaim}</p>
        </div>
        <div>
          <p className="text-black/50 dark:text-white/50">Nomor HP</p>
          <p className="font-medium">{klaim.no_hp}</p>
        </div>
      </div>

      <PengembalianForm claimId={klaim.id} itemId={item.id} />
    </div>
  );
}
