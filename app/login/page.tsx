import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-brand-primary px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 text-base font-bold text-white">
            BP
          </span>
          <p className="text-sm font-medium text-white/70">
            Balai Perpustakaan DPAD DIY
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-white">
            Masuk Petugas
          </h1>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
