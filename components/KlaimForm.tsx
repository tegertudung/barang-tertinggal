"use client";

import { useActionState } from "react";
import { createClaim, type KlaimFormState } from "@/lib/actions/klaim";

const initialState: KlaimFormState = {};

export function KlaimForm({ itemId }: { itemId: string }) {
  const action = createClaim.bind(null, itemId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.nomorKlaim) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950/40">
        <p className="text-sm text-green-800 dark:text-green-300">
          Klaim berhasil diajukan.
        </p>
        <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-200">
          {state.nomorKlaim}
        </p>
        <p className="mt-2 text-sm text-green-800 dark:text-green-300">
          Silakan menunggu proses verifikasi oleh petugas.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Nama Lengkap" htmlFor="nama_pengklaim">
        <input
          id="nama_pengklaim"
          name="nama_pengklaim"
          required
          className={inputClass}
        />
      </Field>

      <Field label="Nomor HP" htmlFor="no_hp">
        <input
          id="no_hp"
          name="no_hp"
          type="tel"
          required
          placeholder="08xxxxxxxxxx"
          className={inputClass}
        />
      </Field>

      <Field label="Perkiraan Waktu Kehilangan" htmlFor="waktu_kehilangan">
        <input
          id="waktu_kehilangan"
          name="waktu_kehilangan"
          placeholder="mis. 31 Agustus 2026, sore hari"
          className={inputClass}
        />
      </Field>

      <Field
        label="Lokasi Terakhir Barang Digunakan"
        htmlFor="lokasi_kehilangan"
      >
        <input
          id="lokasi_kehilangan"
          name="lokasi_kehilangan"
          className={inputClass}
        />
      </Field>

      <Field label="Ciri-ciri Barang" htmlFor="ciri_barang">
        <textarea
          id="ciri_barang"
          name="ciri_barang"
          required
          rows={3}
          placeholder="Jelaskan detail yang hanya diketahui pemilik asli..."
          className={inputClass}
        />
      </Field>

      <Field label="Keterangan Tambahan" htmlFor="keterangan">
        <textarea
          id="keterangan"
          name="keterangan"
          rows={2}
          className={inputClass}
        />
      </Field>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {isPending ? "Mengirim..." : "Ajukan Klaim"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-white/20 dark:bg-white/5";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
