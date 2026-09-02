"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type BarangFormState = {
  error?: string;
};

function ambilString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function uploadFotoJikaAda(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData
): Promise<string | null> {
  const file = formData.get("foto");

  if (!(file instanceof File) || file.size === 0) return null;

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("barang-photos")
    .upload(path, file, { contentType: file.type || "image/jpeg" });

  if (error) {
    throw new Error(`Gagal upload foto: ${error.message}`);
  }

  return path;
}

export async function createItem(
  _prevState: BarangFormState,
  formData: FormData
): Promise<BarangFormState> {
  const supabase = await createClient();

  const kode_barang = ambilString(formData, "kode_barang");
  const nama_barang = ambilString(formData, "nama_barang");
  const kategori = ambilString(formData, "kategori");
  const warna = ambilString(formData, "warna");
  const deskripsi = ambilString(formData, "deskripsi");
  const lokasi_ditemukan = ambilString(formData, "lokasi_ditemukan");
  const tanggal_ditemukan = ambilString(formData, "tanggal_ditemukan");

  if (
    !kode_barang ||
    !nama_barang ||
    !kategori ||
    !lokasi_ditemukan ||
    !tanggal_ditemukan
  ) {
    return { error: "Mohon lengkapi semua kolom wajib." };
  }

  let foto: string | null = null;
  try {
    foto = await uploadFotoJikaAda(supabase, formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal upload foto." };
  }

  const { error } = await supabase.from("items").insert({
    kode_barang,
    nama_barang,
    kategori,
    warna: warna || null,
    deskripsi: deskripsi || null,
    lokasi_ditemukan,
    tanggal_ditemukan,
    foto,
    status: "TERSIMPAN",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Kode barang sudah digunakan, gunakan kode lain." };
    }
    return { error: `Gagal menyimpan barang: ${error.message}` };
  }

  revalidatePath("/dashboard/barang");
  revalidatePath("/");
  redirect("/dashboard/barang");
}

export async function updateItem(
  id: string,
  _prevState: BarangFormState,
  formData: FormData
): Promise<BarangFormState> {
  const supabase = await createClient();

  const kode_barang = ambilString(formData, "kode_barang");
  const nama_barang = ambilString(formData, "nama_barang");
  const kategori = ambilString(formData, "kategori");
  const warna = ambilString(formData, "warna");
  const deskripsi = ambilString(formData, "deskripsi");
  const lokasi_ditemukan = ambilString(formData, "lokasi_ditemukan");
  const tanggal_ditemukan = ambilString(formData, "tanggal_ditemukan");
  const status = ambilString(formData, "status");

  if (
    !kode_barang ||
    !nama_barang ||
    !kategori ||
    !lokasi_ditemukan ||
    !tanggal_ditemukan ||
    !status
  ) {
    return { error: "Mohon lengkapi semua kolom wajib." };
  }

  let foto: string | null = null;
  try {
    foto = await uploadFotoJikaAda(supabase, formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal upload foto." };
  }

  const updateData: Record<string, unknown> = {
    kode_barang,
    nama_barang,
    kategori,
    warna: warna || null,
    deskripsi: deskripsi || null,
    lokasi_ditemukan,
    tanggal_ditemukan,
    status,
  };
  if (foto) updateData.foto = foto;

  const { error } = await supabase.from("items").update(updateData).eq(
    "id",
    id
  );

  if (error) {
    if (error.code === "23505") {
      return { error: "Kode barang sudah digunakan, gunakan kode lain." };
    }
    return { error: `Gagal menyimpan perubahan: ${error.message}` };
  }

  revalidatePath("/dashboard/barang");
  revalidatePath(`/barang/${id}`);
  revalidatePath("/");
  redirect("/dashboard/barang");
}

export async function deleteItem(id: string) {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("items")
    .select("foto")
    .eq("id", id)
    .maybeSingle<{ foto: string | null }>();

  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus barang: ${error.message}`);
  }

  if (item?.foto) {
    await supabase.storage.from("barang-photos").remove([item.foto]);
  }

  revalidatePath("/dashboard/barang");
  revalidatePath("/");
}
