import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal, formatTanggalWaktu } from "@/lib/format";
import { formatNomorKlaim } from "@/types/database";
import { VerifikasiKlaimForm } from "@/components/VerifikasiKlaimForm";
import { KlaimStatusBadge } from "@/components/StatusBadge";
import { IconLock, IconUser } from "@/components/icons";
import type { Item, Claim } from "@/types/database";

export const revalidate = 0;

export default async function DetailKlaimPage({
  params,
}: PageProps<"/dashboard/klaim/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: klaim } = await supabase
    .from("claims")
    .select("*")
    .eq("id", id)
    .maybeSingle<Claim>();

  if (!klaim) notFound();

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", klaim.item_id)
    .maybeSingle<Item>();

  return (
    <div className="max-w-4xl">
      <nav className="mb-1 text-sm text-black/50">
        <Link href="/dashboard/klaim" className="hover:text-brand-primary">
          Klaim Barang
        </Link>
        <span className="mx-1">/</span>
        <span className="font-medium text-brand-primary">
          Verifikasi Klaim {formatNomorKlaim(klaim)}
        </span>
      </nav>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">
            Verifikasi Pengajuan Klaim Pemustaka
          </h1>
          <p className="text-sm text-black/60">
            Diajukan {formatTanggalWaktu(klaim.created_at)}
          </p>
        </div>
        <KlaimStatusBadge status={klaim.status} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-4 flex items-center gap-1.5 text-sm font-semibold">
            <IconUser className="h-4 w-4 text-black/50" />
            Pernyataan Pengklaim (Pemustaka)
          </h2>

          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-bold text-brand-primary">
              {klaim.nama_pengklaim.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="font-semibold">{klaim.nama_pengklaim}</p>
              <a href={`tel:${klaim.no_hp}`} className="text-sm text-brand-primary hover:underline">
                {klaim.no_hp}
              </a>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                Perkiraan Waktu Kehilangan
              </dt>
              <dd className="mt-0.5">{klaim.waktu_kehilangan || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                Lokasi Terakhir Barang Digunakan
              </dt>
              <dd className="mt-0.5">{klaim.lokasi_kehilangan || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                Ciri-ciri Barang (menurut pemohon)
              </dt>
              <dd className="mt-1 rounded-lg bg-black/[0.03] p-3">
                {klaim.ciri_barang}
              </dd>
            </div>
            {klaim.keterangan && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                  Keterangan Tambahan
                </dt>
                <dd className="mt-0.5">{klaim.keterangan}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl border border-brand-primary/20 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold">
              <IconLock className="h-4 w-4 text-black/50" />
              Data Fisik Inventaris
            </h2>
            <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
              Rahasia Petugas
            </span>
          </div>

          {item ? (
            <>
              <dl className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                      Kode Barang
                    </dt>
                    <dd className="mt-0.5 font-mono">{item.kode_barang}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                      Kategori
                    </dt>
                    <dd className="mt-0.5">{item.kategori}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                      Nama Barang
                    </dt>
                    <dd className="mt-0.5">{item.nama_barang}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                      Warna
                    </dt>
                    <dd className="mt-0.5">{item.warna || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                      Lokasi Ditemukan
                    </dt>
                    <dd className="mt-0.5">{item.lokasi_ditemukan}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                      Tanggal Ditemukan
                    </dt>
                    <dd className="mt-0.5">{formatTanggal(item.tanggal_ditemukan)}</dd>
                  </div>
                </div>

                {item.deskripsi && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-black/45">
                      Ciri Khusus Rahasia (catatan petugas pencatat)
                    </dt>
                    <dd className="mt-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                      {item.deskripsi}
                    </dd>
                  </div>
                )}
              </dl>

              <p className="mt-4 rounded-lg bg-black/[0.03] p-3 text-xs text-black/60">
                Bandingkan ciri-ciri yang disebutkan pemohon di panel kiri
                dengan data rahasia di atas. Jika cocok, klaim dapat
                disetujui.
              </p>
            </>
          ) : (
            <p className="text-sm text-black/60">Data barang tidak ditemukan.</p>
          )}
        </div>
      </div>

      {klaim.status === "MENUNGGU" && item ? (
        <div className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold">Catatan Hasil Pemeriksaan Petugas</h2>
          <VerifikasiKlaimForm claimId={klaim.id} itemId={klaim.item_id} />
        </div>
      ) : (
        <div className="rounded-xl border border-black/10 bg-white p-5 text-sm">
          <p className="text-black/50">Catatan Petugas</p>
          <p>{klaim.catatan_petugas || "-"}</p>

          {klaim.status === "DISETUJUI" && (
            <Link
              href={`/dashboard/pengembalian/${klaim.id}`}
              className="mt-4 inline-block rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-dark"
            >
              Proses Pengembalian →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
