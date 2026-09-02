"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { verifyClaim } from "@/lib/actions/klaim";

export function VerifikasiKlaimForm({
  claimId,
  itemId,
}: {
  claimId: string;
  itemId: string;
}) {
  const [catatan, setCatatan] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function submit(keputusan: "DISETUJUI" | "DITOLAK") {
    if (
      keputusan === "DITOLAK" &&
      !confirm("Yakin ingin menolak klaim ini?")
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await verifyClaim(claimId, itemId, keputusan, catatan);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memproses klaim.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="catatan_petugas"
          className="mb-1 block text-sm font-medium"
        >
          Catatan Petugas
        </label>
        <textarea
          id="catatan_petugas"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          rows={3}
          placeholder="Catatan hasil verifikasi (opsional)"
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/20 dark:bg-white/5"
        />
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit("DISETUJUI")}
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          Setujui Klaim
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit("DITOLAK")}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
        >
          Tolak Klaim
        </button>
      </div>
    </div>
  );
}
