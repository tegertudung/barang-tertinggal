"use client";

import { useState, useTransition } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { processReturn } from "@/lib/actions/pengembalian";

export function PengembalianForm({
  claimId,
  itemId,
}: {
  claimId: string;
  itemId: string;
}) {
  const [setuju, setSetuju] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!foto) {
      setError("Ambil foto bukti serah terima terlebih dahulu.");
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.set("foto", foto);
    formData.set("catatan", catatan);

    startTransition(async () => {
      const result = await processReturn(claimId, itemId, {}, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-5">
      <label className="flex items-start gap-2 rounded-md border border-black/10 p-3 text-sm dark:border-white/10">
        <input
          type="checkbox"
          checked={setuju}
          onChange={(e) => setSetuju(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          Saya (petugas) telah menginformasikan kepada pengunjung bahwa foto
          ini diambil sebagai bukti serah terima barang, dan pengunjung
          menyetujuinya.
        </span>
      </label>

      {setuju ? (
        <div>
          <p className="mb-2 text-sm font-medium">Foto Bukti Serah Terima</p>
          <CameraCapture onCapture={setFoto} />
        </div>
      ) : (
        <p className="text-sm text-black/50 dark:text-white/50">
          Centang persetujuan di atas untuk mengaktifkan kamera.
        </p>
      )}

      <div>
        <label htmlFor="catatan" className="mb-1 block text-sm font-medium">
          Catatan
        </label>
        <textarea
          id="catatan"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          rows={3}
          placeholder="mis. Barang telah diserahkan kepada pemilik setelah dilakukan verifikasi."
          className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/20 dark:bg-white/5"
        />
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={isPending || !foto}
        onClick={submit}
        className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Menyimpan..." : "Simpan Pengembalian"}
      </button>
    </div>
  );
}
