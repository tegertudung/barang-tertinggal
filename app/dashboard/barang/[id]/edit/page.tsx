import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BarangForm } from "@/components/BarangForm";
import { updateItem } from "@/lib/actions/barang";
import type { Item } from "@/types/database";

export default async function EditBarangPage({
  params,
}: PageProps<"/dashboard/barang/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle<Item>();

  if (!item) notFound();

  const updateItemWithId = updateItem.bind(null, id);

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">Edit Barang</h1>
      <p className="mb-6 text-sm text-black/60">
        {item.kode_barang} — {item.nama_barang}
      </p>
      <BarangForm action={updateItemWithId} item={item} />
    </div>
  );
}
