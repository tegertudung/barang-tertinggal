"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { IconSearch } from "@/components/icons";

/** Search bar putih dipakai di dalam hero hijau tua. */
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
      className="flex gap-2 rounded-xl bg-white p-1.5 shadow-sm"
    >
      <div className="flex flex-1 items-center gap-2 px-2.5">
        <IconSearch className="h-4 w-4 shrink-0 text-black/40" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama barang, misalnya dompet atau flashdisk"
          className="w-full bg-transparent py-2 text-sm text-black outline-none placeholder:text-black/40"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-brand-accent px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
      >
        Cari
      </button>
    </form>
  );
}
