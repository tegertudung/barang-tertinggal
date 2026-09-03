import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal, formatTanggalWaktu } from "@/lib/format";
import { formatNomorKlaim } from "@/types/database";
import { VerifikasiKlaimForm } from "@/components/VerifikasiKlaimForm";
import { KlaimStatusBadge } from "@/components/StatusBadge";
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
    <div className="max-w-2xl">
      <Link
        href="/dashboard/klaim"
        className="mb-4 inline-block text-sm text-blue-700 hover:underline"
      >
        ← Kembali ke daftar klaim
      </Link>

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">
            Klaim #{formatNomorKlaim(klaim)}
          </h1>
          <p className="text-sm text-black/60">
            Diajukan {formatTanggalWaktu(klaim.created_at)}
          </p>
        </div>
        <KlaimStatusBadge status={klaim.status} />
      </div>

      <div className="mb-6 rounded-lg border border-black/10 p-4">
        <h2 className="mb-3 text-sm font-semibold text-black/60">
          Barang
        </h2>
        {item ? (
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <Detail label="Nama Barang" value={item.nama_barang} />
            <Detail label="Kode Barang" value={item.kode_barang} />
            <Detail label="Kategori" value={item.kategori} />
            <Detail label="Lokasi Ditemukan" value={item.lokasi_ditemukan} />
            <Detail
              label="Tanggal Ditemukan"
              value={formatTanggal(item.tanggal_ditemukan)}
            />
          </div>
        ) : (
          <p className="text-sm text-black/60">
            Data barang tidak ditemukan.
          </p>
        )}
      </div>

      <div className="mb-6 rounded-lg border border-black/10 p-4">
        <h2 className="mb-3 text-sm font-semibold text-black/60">
          Data Pengklaim
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Detail label="Nama" value={klaim.nama_pengklaim} />
          <Detail label="Nomor HP" value={klaim.no_hp} />
          <Detail
            label="Perkiraan Kehilangan"
            value={klaim.waktu_kehilangan || "-"}
          />
          <Detail
            label="Lokasi Terakhir"
            value={klaim.lokasi_kehilangan || "-"}
          />
        </div>
        <div className="mt-3">
          <p className="text-black/50 text-sm">
            Ciri-ciri Barang
          </p>
          <p className="text-sm">{klaim.ciri_barang}</p>
        </div>
        {klaim.keterangan && (
          <div className="mt-3">
            <p className="text-black/50 text-sm">
              Keterangan Tambahan
            </p>
            <p className="text-sm">{klaim.keterangan}</p>
          </div>
        )}
      </div>

      {klaim.status === "MENUNGGU" && item ? (
        <div className="rounded-lg border border-black/10 p-4">
          <h2 className="mb-3 text-sm font-semibold text-black/60">
            Verifikasi Klaim
          </h2>
          <VerifikasiKlaimForm claimId={klaim.id} itemId={klaim.item_id} />
        </div>
      ) : (
        <div className="rounded-lg border border-black/10 p-4 text-sm">
          <p className="text-black/50">Catatan Petugas</p>
          <p>{klaim.catatan_petugas || "-"}</p>

          {klaim.status === "DISETUJUI" && (
            <Link
              href={`/dashboard/pengembalian/${klaim.id}`}
              className="mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Proses Pengembalian →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-black/50">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
