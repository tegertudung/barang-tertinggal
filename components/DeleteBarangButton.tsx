"use client";

import { useTransition } from "react";
import { deleteItem } from "@/lib/actions/barang";

export function DeleteBarangButton({
  id,
  nama,
}: {
  id: string;
  nama: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Hapus barang "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
          return;
        }
        startTransition(() => {
          deleteItem(id);
        });
      }}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}
