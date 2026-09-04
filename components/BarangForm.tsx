"use client";

import { useActionState } from "react";
import Image from "next/image";
import { KATEGORI_LIST } from "@/lib/categories";
import type { BarangFormState } from "@/lib/actions/barang";
import type { Item } from "@/types/database";
import { getBarangFotoUrl } from "@/lib/storage";
import { IconInfo, IconLock, IconUpload } from "@/components/icons";

const initialState: BarangFormState = {};

export function BarangForm({
  action,
  item,
  suggestedKode,
  petugasNama,
}: {
  action: (
    prevState: BarangFormState,
    formData: FormData
  ) => Promise<BarangFormState>;
  item?: Item;
  suggestedKode?: string;
  petugasNama?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const fotoUrl = item ? getBarangFotoUrl(item.foto) : null;

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 rounded-xl border border-black/10 bg-white p-5 lg:col-span-2">
        <h2 className="font-semibold">Identifikasi Fisik Barang</h2>

        <Field label="Kode Registrasi Barang" htmlFor="kode_barang">
          {!item ? (
            <input
              id="kode_barang"
              name="kode_barang"
              required
              readOnly
              defaultValue={suggestedKode}
              className={`${inputClass} cursor-not-allowed bg-black/5 font-mono`}
            />
          ) : (
            <input
              id="kode_barang"
              name="kode_barang"
              required
              defaultValue={item.kode_barang}
              className={`${inputClass} font-mono`}
            />
          )}
          {!item && (
            <p className="mt-1 flex items-center gap-1 text-xs text-black/45">
              <IconLock className="h-3 w-3" />
              Terisi otomatis oleh sistem
            </p>
          )}
        </Field>

        <Field label="Nama Barang" htmlFor="nama_barang" required>
          <input
            id="nama_barang"
            name="nama_barang"
            required
            placeholder="cth: Dompet Lipat Hitam Eiger"
            defaultValue={item?.nama_barang}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Kategori Barang" htmlFor="kategori" required>
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

          <Field label="Warna Dominan" htmlFor="warna">
            <input
              id="warna"
              name="warna"
              placeholder="cth: Hitam bergaris merah"
              defaultValue={item?.warna ?? ""}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Lokasi Ditemukan" htmlFor="lokasi_ditemukan" required>
            <input
              id="lokasi_ditemukan"
              name="lokasi_ditemukan"
              required
              placeholder="Ruang Baca Referensi Lt. 2"
              defaultValue={item?.lokasi_ditemukan}
              className={inputClass}
            />
          </Field>

          <Field label="Tanggal Ditemukan" htmlFor="tanggal_ditemukan" required>
            <input
              id="tanggal_ditemukan"
              name="tanggal_ditemukan"
              type="date"
              required
              defaultValue={item?.tanggal_ditemukan}
              className={inputClass}
            />
          </Field>
        </div>

        <div>
          <label htmlFor="deskripsi" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
            <IconLock className="h-3.5 w-3.5 text-black/40" />
            Deskripsi Detail &amp; Ciri Khusus Rahasia
            <span className="ml-auto rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black/50">
              Internal Only
            </span>
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={3}
            placeholder="Tuliskan nomor seri/IMEI, jumlah uang tunai di dompet, gantungan kunci khas, stiker laptop, merk kartu ATM, robekan kecil..."
            defaultValue={item?.deskripsi ?? ""}
            className={inputClass}
          />
          <p className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
            <IconInfo className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>Catatan penting:</strong> rincian ini hanya dapat
              diakses petugas internal dan tidak akan ditampilkan di halaman
              publik. Tuliskan ciri rahasia untuk validasi pemustaka sebelum
              serah terima.
            </span>
          </p>
        </div>

        {item && (
          <Field label="Status" htmlFor="status" required>
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

        {state.error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-black/10 pt-4">
          <a
            href="/dashboard/barang"
            className="rounded-md border border-black/15 px-4 py-2.5 text-sm font-semibold hover:bg-black/5"
          >
            Batal
          </a>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {isPending ? "Menyimpan..." : item ? "Simpan Perubahan" : "Simpan ke Inventaris"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-3 font-semibold">Dokumentasi Fisik</h2>

          {fotoUrl && (
            <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg border border-black/10">
              <Image src={fotoUrl} alt="Foto saat ini" fill sizes="320px" className="object-cover" />
            </div>
          )}

          <label
            htmlFor="foto"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black/15 bg-black/[0.02] px-4 py-8 text-center hover:border-brand-primary hover:bg-brand-primary/5"
          >
            <IconUpload className="h-6 w-6 text-black/40" />
            <span className="text-sm font-medium">Pilih Berkas Foto</span>
            <span className="text-xs text-black/45">JPG, PNG (maks. 5MB)</span>
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
          {item && (
            <p className="mt-2 text-xs text-black/50">
              Biarkan kosong jika tidak ingin mengganti foto.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <IconLock className="h-3.5 w-3.5" />
            Kendali Privasi Publik
          </h3>
          <p className="text-xs leading-relaxed text-black/60">
            Foto barang <strong>tidak pernah</strong> ditampilkan di halaman
            publik. Katalog publik hanya menampilkan ikon kategori, untuk
            mencegah klaim fiktif dan menjaga kerahasiaan kepemilikan.
          </p>
        </div>

        {petugasNama && (
          <div className="rounded-xl border border-black/10 bg-white p-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/50">
              Petugas Pencatat Inventaris
            </h3>
            <p className="text-sm font-semibold">{petugasNama}</p>
            <p className="text-xs text-black/45">Tercatat pada: Hari ini</p>
          </div>
        )}
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
