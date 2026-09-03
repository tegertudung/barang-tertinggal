"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/components/Icon";

/** Search bar utama di halaman Beranda. */
export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function submit() {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-2.5 md:flex-row"
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-m3-on-surface-variant">
          <Icon name="search" className="!text-[22px]" />
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ketik nama barang, kode registrasi, atau lokasi ruang..."
          className="w-full rounded-xl border border-m3-outline-variant/60 bg-m3-surface-container-low/40 py-3 pl-11 pr-4 text-sm text-m3-on-surface outline-none transition-all placeholder:text-m3-on-surface-variant/70 focus:border-m3-primary focus:bg-m3-surface-container-lowest focus:ring-2 focus:ring-m3-primary/20"
        />
      </div>
      <button
        type="submit"
        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-m3-secondary-container px-7 py-3 text-sm font-semibold text-m3-on-secondary-container shadow-xs transition-all hover:bg-m3-secondary hover:text-white"
      >
        <Icon name="search" className="!text-[18px]" />
        Cari Barang
      </button>
    </form>
  );
}
