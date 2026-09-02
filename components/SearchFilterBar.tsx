"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { KATEGORI_LIST } from "@/lib/categories";

export function SearchFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const activeKategori = searchParams.get("kategori") ?? "";

  function pushParams(next: { q?: string; kategori?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    const nextQ = next.q ?? q;
    const nextKategori = next.kategori ?? activeKategori;

    if (nextQ) params.set("q", nextQ);
    else params.delete("q");

    if (nextKategori) params.set("kategori", nextKategori);
    else params.delete("kategori");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          pushParams({ q });
        }}
        className="flex gap-2"
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Cari nama barang, kategori, atau lokasi..."
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/20 dark:bg-white/5"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Cari
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="Semua"
          active={activeKategori === ""}
          onClick={() => pushParams({ kategori: "" })}
        />
        {KATEGORI_LIST.map((kategori) => (
          <FilterChip
            key={kategori}
            label={kategori}
            active={activeKategori === kategori}
            onClick={() => pushParams({ kategori })}
          />
        ))}
      </div>

      {isPending && (
        <p className="text-xs text-black/50 dark:text-white/50">
          Memuat...
        </p>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-black/15 text-black/70 hover:bg-black/5 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
