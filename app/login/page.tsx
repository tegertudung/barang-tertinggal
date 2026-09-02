import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
            BARANG TERTINGGAL
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Login Petugas Layanan &amp; Informasi
          </p>
        </div>

        <div className="rounded-lg border border-black/10 p-6 dark:border-white/10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
