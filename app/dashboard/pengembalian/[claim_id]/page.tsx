import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PengembalianForm } from "@/components/PengembalianForm";
import { formatTanggalWaktu, todayFormatted } from "@/lib/format";
import type { Claim, Item, Return } from "@/types/database";
import { formatNomorKlaim } from "@/types/database";

export const revalidate = 0;

export default async function ProsesPengembalianPage({
  params,
}: PageProps<"/dashboard/pengembalian/[claim_id]">) {
  const { claim_id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let petugasNama = user?.email ?? "Petugas";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nama")
      .eq("id", user.id)
      .maybeSingle<{ nama: string }>();
    if (profile?.nama) petugasNama = profile.nama;
  }

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
          className="mb-4 inline-block text-sm text-brand-primary hover:underline"
        >
          ← Kembali ke riwayat pengembalian
        </Link>

        <h1 className="mb-1 text-xl font-bold">Pengembalian Selesai</h1>
        <p className="mb-6 text-sm text-black/60">
          Klaim #{formatNomorKlaim(klaim)} — {item.nama_barang}
        </p>

        <div className="space-y-4 rounded-xl border border-black/10 bg-white p-5 text-sm">
          <div>
            <p className="text-black/50">Pengklaim</p>
            <p className="font-medium">{klaim.nama_pengklaim}</p>
          </div>
          {returnRecord && (
            <div>
              <p className="text-black/50">
                Tanggal Pengembalian
              </p>
              <p className="font-medium">
                {formatTanggalWaktu(returnRecord.tanggal_pengembalian)}
              </p>
            </div>
          )}
          {returnRecord?.catatan && (
            <div>
              <p className="text-black/50">Catatan</p>
              <p>{returnRecord.catatan}</p>
            </div>
          )}
          <div>
            <p className="mb-2 text-black/50">
              Foto Bukti Serah Terima
            </p>
            {signedUrl ? (
              <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-md border border-black/10">
                <Image
                  src={signedUrl}
                  alt="Bukti serah terima"
                  fill
                  sizes="384px"
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="text-black/50">
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
          className="mb-4 inline-block text-sm text-brand-primary hover:underline"
        >
          ← Kembali ke detail klaim
        </Link>
        <p className="rounded-md border border-black/10 bg-white p-4 text-sm text-black/60">
          Klaim ini belum/tidak dalam status siap dikembalikan (status saat
          ini: {klaim.status}).
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <nav className="mb-1 text-sm text-black/50">
        <Link href="/dashboard/pengembalian" className="hover:text-brand-primary">
          Layanan Pengembalian
        </Link>
        <span className="mx-1">/</span>
        <span className="font-medium text-brand-primary">Proses Serah Terima</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-xl font-bold">Proses Serah Terima &amp; Dokumentasi</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
          Klaim Disetujui ({formatNomorKlaim(klaim)})
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-black/10 bg-white p-5 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-black/45">Barang Temuan</p>
          <p className="mt-0.5 font-semibold">{item.nama_barang}</p>
          <p className="font-mono text-xs text-black/45">{item.kode_barang}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-black/45">Pemilik</p>
          <p className="mt-0.5 font-semibold">{klaim.nama_pengklaim}</p>
          <p className="text-xs text-black/45">{klaim.no_hp}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-black/45">Petugas Meja Layanan</p>
          <p className="mt-0.5 font-semibold">{petugasNama}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-black/45">Tanggal Serah Terima</p>
          <p className="mt-0.5 font-semibold">{todayFormatted()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold">Pengambilan Foto Bukti Serah Terima</h2>
        <PengembalianForm claimId={klaim.id} itemId={item.id} />
      </div>
    </div>
  );
}
