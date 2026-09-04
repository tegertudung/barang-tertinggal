"use client";

import { IconFileText } from "@/components/icons";
import type { Item } from "@/types/database";

function toCsvValue(v: string | null | undefined) {
  const s = (v ?? "").replace(/"/g, '""');
  return `"${s}"`;
}

/** Unduh daftar barang yang sedang ditampilkan sebagai file CSV. */
export function ExportCsvButton({ items }: { items: Item[] }) {
  function handleExport() {
    const header = [
      "Kode Barang",
      "Nama Barang",
      "Kategori",
      "Warna",
      "Lokasi Ditemukan",
      "Tanggal Ditemukan",
      "Status",
    ];
    const rows = items.map((i) =>
      [i.kode_barang, i.nama_barang, i.kategori, i.warna ?? "", i.lokasi_ditemukan, i.tanggal_ditemukan, i.status]
        .map(toCsvValue)
        .join(",")
    );
    const csv = [header.map(toCsvValue).join(","), ...rows].join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-barang-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={items.length === 0}
      className="flex items-center gap-1.5 rounded-md border border-black/15 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/5 disabled:opacity-50"
    >
      <IconFileText className="h-3.5 w-3.5" />
      Unduh CSV
    </button>
  );
}
