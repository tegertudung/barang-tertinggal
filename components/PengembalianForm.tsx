"use client";

import { useState, useTransition } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { processReturn } from "@/lib/actions/pengembalian";
import { IconInfo } from "@/components/icons";

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
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <IconInfo className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Beri tahu pengunjung sebelum memotret sebagai bukti serah terima.</span>
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={setuju}
          onChange={(e) => setSetuju(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-black/70">
          Saya (petugas) telah menginformasikan hal di atas kepada pengunjung,
          dan pengunjung menyetujuinya.
        </span>
      </label>

      <div>
        <p className="mb-2 text-sm font-medium">Foto Bukti Serah Terima</p>
        {setuju ? (
          <CameraCapture onCapture={setFoto} />
        ) : (
          <p className="text-sm text-black/50">
            Centang persetujuan di atas untuk mengaktifkan kamera.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="catatan" className="mb-1 block text-sm font-medium">
          Catatan
        </label>
        <textarea
          id="catatan"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          rows={3}
          placeholder="Catatan pengembalian"
          className="w-full max-w-sm rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
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
        className="w-full max-w-sm rounded-md bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
      >
        {isPending ? "Menyimpan..." : "Simpan Pengembalian"}
      </button>
    </div>
  );
}
