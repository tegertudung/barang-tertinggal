"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { KATEGORI_LIST } from "@/lib/categories";

/** Baris chip filter kategori, dipakai di bawah hero pada latar putih. */
export function KategoriChips() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const activeKategori = searchParams.get("kategori") ?? "";

  function setKategori(kategori: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (kategori) params.set("kategori", kategori);
    else params.delete("kategori");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className={`flex flex-wrap gap-2 ${isPending ? "opacity-60" : ""}`}>
      <Chip label="Semua" active={activeKategori === ""} onClick={() => setKategori("")} />
      {KATEGORI_LIST.map((kategori) => (
        <Chip
          key={kategori}
          label={kategori}
          active={activeKategori === kategori}
          onClick={() => setKategori(kategori)}
        />
      ))}
    </div>
  );
}

function Chip({
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
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "border-brand-primary bg-brand-primary text-white"
          : "border-black/15 text-black/70 hover:bg-black/5"
      }`}
    >
      {label}
    </button>
  );
}
