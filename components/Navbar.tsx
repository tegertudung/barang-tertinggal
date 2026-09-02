import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-wide text-blue-700 dark:text-blue-400">
            BARANG TERTINGGAL
          </span>
          <span className="text-xs text-black/60 dark:text-white/60">
            Balai Perpustakaan DPAD DIY
          </span>
        </Link>

        <Link
          href="/login"
          className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Login Petugas
        </Link>
      </div>
    </header>
  );
}
