"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Komponen kamera bukti serah terima. Alur:
 * BUKA KAMERA -> preview live -> AMBIL FOTO -> preview hasil
 * -> GUNAKAN FOTO / AMBIL ULANG.
 *
 * Foto hasil disimpan sebagai File lewat callback onCapture, supaya
 * bisa disisipkan ke FormData oleh komponen pemanggil.
 */
export function CameraCapture({
  onCapture,
}: {
  onCapture: (file: File | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch {
      setError(
        "Tidak bisa mengakses kamera. Pastikan izin kamera diberikan pada browser."
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

  function ambilUlang() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onCapture(null);
    bukaKamera();
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {previewUrl ? (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview bukti serah terima"
            className="w-full max-w-sm rounded-md border border-black/10 dark:border-white/10"
          />
          <button
            type="button"
            onClick={ambilUlang}
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Ambil Ulang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full max-w-sm rounded-md border border-black/10 bg-black dark:border-white/10 ${
              isCameraOn ? "block" : "hidden"
            }`}
          />

          {!isCameraOn ? (
            <button
              type="button"
              onClick={bukaKamera}
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              📷 Buka Kamera
            </button>
          ) : (
            <button
              type="button"
              onClick={ambilFoto}
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Ambil Foto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
