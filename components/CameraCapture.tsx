"use client";

import { useEffect, useRef, useState } from "react";
import { IconCamera, IconUpload } from "@/components/icons";

/**
 * Komponen foto bukti serah terima. Dua jalur:
 * - BUKA KAMERA -> preview live -> AMBIL FOTO -> preview hasil.
 * - UPLOAD FOTO -> pilih file dari galeri/penyimpanan perangkat.
 *
 * Foto hasil disimpan sebagai File lewat callback onCapture, supaya
 * bisa disisipkan ke FormData oleh komponen pemanggil.
 *
 * PENTING: elemen <video> selalu ter-mount (disembunyikan lewat
 * `hidden`, bukan lewat conditional return) supaya `videoRef.current`
 * tetap valid saat stream kamera baru didapat -- kalau video hanya
 * dirender setelah `isCameraOn` true, srcObject sempat diisi ke ref
 * yang masih null (video belum ke-mount) dan preview tampil hitam.
 */
export function CameraCapture({
  onCapture,
}: {
  onCapture: (file: File | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function bukaKamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraOn(true);

      // Tunggu render berikutnya supaya <video> pasti sudah ter-mount
      // sebelum srcObject diisi.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setError(
        "Tidak bisa mengakses kamera. Pastikan izin kamera diberikan pada browser, atau gunakan opsi Upload Foto."
      );
    }
  }

  function tutupKamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraOn(false);
  }

  function ambilFoto() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "bukti-serah-terima.jpg", {
          type: "image/jpeg",
        });
        setPreviewUrl(URL.createObjectURL(blob));
        onCapture(file);
        tutupKamera();
      },
      "image/jpeg",
      0.9
    );
  }

  function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    tutupKamera();
    setPreviewUrl(URL.createObjectURL(file));
    onCapture(file);
  }

  function ambilUlang() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onCapture(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const showVideo = isCameraOn && !previewUrl;

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl ?? undefined}
        alt="Preview bukti serah terima"
        hidden={!previewUrl}
        className="w-full max-w-sm rounded-xl border border-black/10"
      />

      <video
        ref={videoRef}
        playsInline
        muted
        hidden={!showVideo}
        className="w-full max-w-sm rounded-xl border border-black/10 bg-black"
      />

      {previewUrl && (
        <button
          type="button"
          onClick={ambilUlang}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5"
        >
          Ambil Ulang
        </button>
      )}

      {showVideo && (
        <button
          type="button"
          onClick={ambilFoto}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Ambil Foto
        </button>
      )}

      {!isCameraOn && !previewUrl && (
        <div className="flex max-w-sm flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={bukaKamera}
            className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-black/15 bg-black/[0.02] py-10 text-center hover:border-amber-400 hover:bg-amber-50/50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white">
              <IconCamera className="h-6 w-6" />
            </span>
            <span className="text-sm font-semibold">Buka Kamera</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-black/15 bg-black/[0.02] py-10 text-center hover:border-amber-400 hover:bg-amber-50/50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 text-black/60">
              <IconUpload className="h-6 w-6" />
            </span>
            <span className="text-sm font-semibold">Upload Foto</span>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFilePicked}
        hidden
      />
    </div>
  );
}
