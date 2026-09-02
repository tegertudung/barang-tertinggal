"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatNomorKlaim } from "@/types/database";

export type KlaimFormState = {
  error?: string;
  nomorKlaim?: string;
};

function ambilString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createClaim(
  itemId: string,
  _prevState: KlaimFormState,
  formData: FormData
): Promise<KlaimFormState> {
  const nama_pengklaim = ambilString(formData, "nama_pengklaim");
  const no_hp = ambilString(formData, "no_hp");
  const waktu_kehilangan = ambilString(formData, "waktu_kehilangan");
  const lokasi_kehilangan = ambilString(formData, "lokasi_kehilangan");
  const ciri_barang = ambilString(formData, "ciri_barang");
  const keterangan = ambilString(formData, "keterangan");

  if (!nama_pengklaim || !no_hp || !ciri_barang) {
    return {
      error: "Nama lengkap, nomor HP, dan ciri-ciri barang wajib diisi.",
    };
  }

  const supabase = await createClient();

  // submit_claim adalah database function (SECURITY DEFINER) supaya
  // publik tidak perlu diberi hak SELECT langsung ke tabel claims —
  // lihat docs/migration-submit-claim-function.sql
  const { data, error } = await supabase
    .rpc("submit_claim", {
      p_item_id: itemId,
      p_nama_pengklaim: nama_pengklaim,
      p_no_hp: no_hp,
      p_waktu_kehilangan: waktu_kehilangan || null,
      p_lokasi_kehilangan: lokasi_kehilangan || null,
      p_ciri_barang: ciri_barang,
      p_keterangan: keterangan || null,
    })
    .single<{ nomor_urut: number; created_at: string }>();

  if (error || !data) {
    return {
      error: error?.message ?? "Gagal mengirim klaim, coba lagi.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/klaim");

  return { nomorKlaim: formatNomorKlaim(data) };
}

export async function verifyClaim(
  claimId: string,
  itemId: string,
  keputusan: "DISETUJUI" | "DITOLAK",
  catatan: string
) {
  const supabase = await createClient();

  const { error: claimError } = await supabase
    .from("claims")
    .update({ status: keputusan, catatan_petugas: catatan || null })
    .eq("id", claimId);

  if (claimError) {
    throw new Error(`Gagal memperbarui klaim: ${claimError.message}`);
  }

  if (keputusan === "DISETUJUI") {
    const { error: itemError } = await supabase
      .from("items")
      .update({ status: "DIKLAIM" })
      .eq("id", itemId);

    if (itemError) {
      throw new Error(`Gagal memperbarui status barang: ${itemError.message}`);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/klaim");
  revalidatePath(`/dashboard/klaim/${claimId}`);
  revalidatePath("/");
}
