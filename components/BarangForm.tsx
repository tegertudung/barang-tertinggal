"use client";

import { useActionState } from "react";
import Image from "next/image";
import { KATEGORI_LIST } from "@/lib/categories";
import type { BarangFormState } from "@/lib/actions/barang";
import type { Item } from "@/types/database";
import { getBarangFotoUrl } from "@/lib/storage";

const initialState: BarangFormState = {};

export function BarangForm({
  action,
  item,
}: {
  action: (
    prevState: BarangFormState,
    formData: FormData
  ) => Promise<BarangFormState>;
  item?: Item;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const fotoUrl = item ? getBarangFotoUrl(item.foto) : null;

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <Field label="Kode Barang" htmlFor="kode_barang">
        <input
          id="kode_barang"
          name="kode_barang"
          required
          defaultValue={item?.kode_barang}
          placeholder="BLG-2026-001"
          className={inputClass}
        />
      </Field>

      <Field label="Nama Barang" htmlFor="nama_barang">
        <input
          id="nama_barang"
          name="nama_barang"
          required
          defaultValue={item?.nama_barang}
          className={inputClass}
        />
      </Field>

      <Field label="Kategori" htmlFor="kategori">
        <select
          id="kategori"
          name="kategori"
          required
          defaultValue={item?.kategori ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          {KATEGORI_LIST.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Warna" htmlFor="warna">
        <input
          id="warna"
          name="warna"
          defaultValue={item?.warna ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Lokasi Ditemukan" htmlFor="lokasi_ditemukan">
        <input
          id="lokasi_ditemukan"
          name="lokasi_ditemukan"
          required
          defaultValue={item?.lokasi_ditemukan}
          placeholder="Ruang Baca Lt. 2"
          className={inputClass}
        />
      </Field>

      <Field label="Tanggal Ditemukan" htmlFor="tanggal_ditemukan">
        <input
          id="tanggal_ditemukan"
          name="tanggal_ditemukan"
          type="date"
          required
          defaultValue={item?.tanggal_ditemukan}
          className={inputClass}
        />
      </Field>

      <Field label="Deskripsi" htmlFor="deskripsi">
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={3}
          defaultValue={item?.deskripsi ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Foto Barang" htmlFor="foto">
        {fotoUrl && (
          <div className="relative mb-2 h-32 w-32 overflow-hidden rounded-md border border-black/10">
            <Image
              src={fotoUrl}
              alt="Foto saat ini"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        )}
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/*"
          className="block w-full text-sm"
        />
        {item && (
          <p className="mt-1 text-xs text-black/50">
            Biarkan kosong jika tidak ingin mengganti foto.
          </p>
        )}
      </Field>

      {item && (
        <Field label="Status" htmlFor="status">
          <select
            id="status"
            name="status"
            required
            defaultValue={item.status}
            className={inputClass}
          >
            <option value="TERSIMPAN">Tersimpan</option>
            <option value="DIKLAIM">Diklaim</option>
            <option value="DIKEMBALIKAN">Dikembalikan</option>
          </select>
        </Field>
      )}

      {!item && (
        <Field label="Status" htmlFor="status-display">
          <input
            id="status-display"
            disabled
            value="Tersimpan"
            className={`${inputClass} bg-black/5`}
          />
        </Field>
      )}

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600";

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
