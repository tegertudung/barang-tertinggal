"use client";

import { useActionState } from "react";
import { createClaim, type KlaimFormState } from "@/lib/actions/klaim";
import Link from "next/link";
import { renderKategoriIcon } from "@/lib/categories";
import { Icon } from "@/components/Icon";

const initialState: KlaimFormState = {};

export function KlaimForm({
  itemId,
  namaBarang,
  lokasi,
  kategori,
}: {
  itemId: string;
  namaBarang: string;
  lokasi: string;
  kategori: string;
}) {
  const action = createClaim.bind(null, itemId);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  if (state.nomorKlaim) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-m3-outline-variant/50 bg-m3-surface-container-lowest p-8 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
          <Icon name="check_circle" className="!text-[28px]" />
        </span>
        <h2 className="text-lg font-bold">Klaim Berhasil Diajukan</h2>

        <div className="mt-4 w-full max-w-xs rounded-lg border border-m3-outline-variant/40 bg-m3-surface-container-low px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-m3-on-surface-variant">
            Nomor Klaim
          </p>
          <p className="mt-1 text-xl font-bold tracking-tight text-m3-primary">
            {state.nomorKlaim}
          </p>
        </div>

        <p className="mt-4 max-w-sm text-sm text-m3-on-surface-variant">
          Petugas kami akan menghubungi Anda melalui nomor HP yang telah
          didaftarkan untuk proses verifikasi lebih lanjut.
        </p>

        <div className="mt-4 flex w-full items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-900">
          <Icon name="info" className="mt-0.5 !text-[18px] shrink-0" />
          <span>
            Mohon membawa kartu identitas asli (KTP/SIM/KTM) saat mengambil
            barang di meja layanan.
          </span>
        </div>

        <Link
          href="/"
          className="mt-6 rounded-lg border border-m3-outline-variant px-5 py-2.5 text-sm font-semibold text-m3-on-surface hover:bg-m3-surface-container"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-m3-outline-variant/40 bg-m3-surface-container-low p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-m3-surface-container-lowest text-m3-primary">
          {renderKategoriIcon(kategori, "!text-[20px]")}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-m3-on-surface-variant">Mengajukan klaim untuk</p>
          <p className="truncate text-sm font-semibold">
            {namaBarang} · {lokasi}
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <Field label="Nama Lengkap" htmlFor="nama_pengklaim" error={errors.nama_pengklaim}>
          <input
            id="nama_pengklaim"
            name="nama_pengklaim"
            required
            placeholder="Sesuai identitas resmi"
            className={inputClass(!!errors.nama_pengklaim)}
          />
        </Field>

        <Field label="Nomor HP" htmlFor="no_hp" error={errors.no_hp}>
          <input
            id="no_hp"
            name="no_hp"
            type="tel"
            required
            placeholder="08xxxxxxxxxx"
            className={inputClass(!!errors.no_hp)}
          />
        </Field>

        <Field label="Perkiraan Waktu Kehilangan" htmlFor="waktu_kehilangan">
          <input
            id="waktu_kehilangan"
            name="waktu_kehilangan"
            type="date"
            className={inputClass(false)}
          />
        </Field>

        <Field
          label="Lokasi Terakhir Barang Digunakan"
          htmlFor="lokasi_kehilangan"
        >
          <input
            id="lokasi_kehilangan"
            name="lokasi_kehilangan"
            placeholder="Contoh: Meja baca dekat rak referensi"
            className={inputClass(false)}
          />
        </Field>

        <Field label="Ciri-ciri Barang" htmlFor="ciri_barang" error={errors.ciri_barang}>
          <textarea
            id="ciri_barang"
            name="ciri_barang"
            required
            rows={3}
            placeholder="Jelaskan detail yang hanya diketahui pemilik, misalnya isi dompet atau tanda khusus"
            className={inputClass(!!errors.ciri_barang)}
          />
        </Field>

        <Field label="Keterangan Tambahan" htmlFor="keterangan">
          <textarea
            id="keterangan"
            name="keterangan"
            rows={2}
            placeholder="Opsional"
            className={inputClass(false)}
          />
        </Field>

        <div>
          <label className="flex items-start gap-2 text-sm text-m3-on-surface-variant">
            <input
              type="checkbox"
              name="persetujuan"
              required
              className="mt-0.5"
            />
            Saya menyatakan bahwa data yang saya isi adalah benar dan dapat
            dipertanggungjawabkan.
          </label>
          {errors.persetujuan && (
            <p className="mt-1 text-xs text-red-600">{errors.persetujuan}</p>
          )}
        </div>

        {state.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-m3-secondary-container px-4 py-3 text-sm font-semibold text-m3-on-secondary-container shadow-xs hover:bg-m3-secondary hover:text-white disabled:opacity-60"
        >
          {isPending ? "Mengirim..." : "Ajukan Klaim"}
        </button>
      </form>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-m3-surface-container-lowest px-3 py-2.5 text-sm text-m3-on-surface outline-none placeholder:text-m3-on-surface-variant/60 ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-m3-outline-variant/60 focus:border-m3-primary"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
