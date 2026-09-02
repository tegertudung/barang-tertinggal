"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PengembalianState = {
  error?: string;
};

export async function processReturn(
  claimId: string,
  itemId: string,
  _prevState: PengembalianState,
  formData: FormData
): Promise<PengembalianState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi login tidak ditemukan, silakan login ulang." };
  }

  const foto = formData.get("foto");
  const catatan = String(formData.get("catatan") ?? "").trim();

  if (!(foto instanceof File) || foto.size === 0) {
    return { error: "Foto bukti serah terima wajib diambil terlebih dahulu." };
  }

  // Pastikan klaim masih berstatus DISETUJUI (belum diproses sebelumnya).
  const { data: klaim } = await supabase
    .from("claims")
    .select("status")
    .eq("id", claimId)
    .maybeSingle<{ status: string }>();

  if (!klaim || klaim.status !== "DISETUJUI") {
    return { error: "Klaim ini tidak dalam status siap dikembalikan." };
  }

  const path = `${claimId}-${crypto.randomUUID()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("bukti-serah-terima")
    .upload(path, foto, { contentType: foto.type || "image/jpeg" });

  if (uploadError) {
    return { error: `Gagal upload foto bukti: ${uploadError.message}` };
  }

  const { error: returnError } = await supabase.from("returns").insert({
    claim_id: claimId,
    petugas_id: user.id,
    foto_serah_terima: path,
    catatan: catatan || null,
  });

  if (returnError) {
    return { error: `Gagal menyimpan pengembalian: ${returnError.message}` };
  }

  const { error: claimUpdateError } = await supabase
    .from("claims")
    .update({ status: "SELESAI" })
    .eq("id", claimId);

  if (claimUpdateError) {
    return { error: `Gagal memperbarui status klaim: ${claimUpdateError.message}` };
  }

  const { error: itemUpdateError } = await supabase
    .from("items")
    .update({ status: "DIKEMBALIKAN" })
    .eq("id", itemId);

  if (itemUpdateError) {
    return { error: `Gagal memperbarui status barang: ${itemUpdateError.message}` };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/klaim");
  revalidatePath("/dashboard/pengembalian");
  revalidatePath("/");
  redirect("/dashboard/pengembalian");
}
