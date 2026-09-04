/**
 * Helper format tanggal & status untuk ditampilkan ke pengguna (id-ID).
 */
export function formatTanggal(tanggal: string) {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatTanggalWaktu(tanggal: string) {
  return new Date(tanggal).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ITEM_STATUS_LABEL: Record<string, string> = {
  TERSIMPAN: "Tersimpan",
  DIKLAIM: "Diklaim",
  DIKEMBALIKAN: "Dikembalikan",
};

const CLAIM_STATUS_LABEL: Record<string, string> = {
  MENUNGGU: "Menunggu Verifikasi",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
  SELESAI: "Selesai",
};

export function labelStatusBarang(status: string) {
  return ITEM_STATUS_LABEL[status] ?? status;
}

export function labelStatusKlaim(status: string) {
  return CLAIM_STATUS_LABEL[status] ?? status;
}

/** ISO timestamp N hari yang lalu dari sekarang. */
export function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/** Jumlah hari bulat sejak `createdAt` hingga sekarang (minimal 0). */
export function daysSince(createdAt: string) {
  const ms = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/** Tanggal hari ini, format lengkap: "Senin, 26 Oktober 2026". */
export function todayFormatted() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Samarkan sebagian nomor HP, mis. "0812-2344-xxxx". */
export function maskNoHp(noHp: string) {
  const digits = noHp.replace(/\D/g, "");
  if (digits.length <= 4) return noHp;
  return digits.slice(0, -4) + "xxxx";
}
