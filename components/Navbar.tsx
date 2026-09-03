import Image from "next/image";
import Link from "next/link";
import { IconLogin } from "@/components/icons";

export function Navbar() {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt="Logo Balai Yanpus DPAD DIY"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-black/80">
            Balai Perpustakaan DPAD DIY
          </span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-1.5 text-sm font-medium text-black/60 hover:text-brand-primary"
        >
          <IconLogin className="h-4 w-4" />
          Masuk Petugas
        </Link>
      </div>
    </header>
  );
}
