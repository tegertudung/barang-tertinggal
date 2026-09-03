"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { KATEGORI_LIST, kategoriIconName } from "@/lib/categories";
import { Icon } from "@/components/Icon";

/** Baris chip filter kategori bergaya Material 3. */
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
    <div className={`flex flex-1 flex-wrap items-center gap-2 overflow-x-auto ${isPending ? "opacity-60" : ""}`}>
      <Chip
        label="Semua"
        icon="apps"
        active={activeKategori === ""}
        onClick={() => setKategori("")}
      />
      {KATEGORI_LIST.map((kategori) => (
        <Chip
          key={kategori}
          label={kategori}
          icon={kategoriIconName(kategori)}
          active={activeKategori === kategori}
          onClick={() => setKategori(kategori)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-m3-primary-container font-bold text-m3-on-primary shadow-xs"
          : "border border-m3-outline-variant bg-m3-surface-container-lowest text-m3-on-surface-variant hover:border-m3-primary hover:text-m3-primary"
      }`}
    >
      <Icon name={icon} className="!text-[16px]" />
      {label}
    </button>
  );
}
