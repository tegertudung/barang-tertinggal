# Checklist Data Placeholder — WAJIB Diganti Sebelum Go-Live

Halaman publik v2 (Beranda, Panduan & SOP, FAQ) dibuat dari mockup yang
berisi banyak data contoh (dibuat AI, bukan data resmi Balai). Semua
titik ini **ditandai jelas di halaman** dengan banner "Konten Contoh",
tapi tetap didaftar di sini supaya tidak ada yang terlewat sebelum
website benar-benar dipakai publik.

## Kontak & Lokasi (Navbar + Footer)
- [ ] Alamat lengkap kantor
- [ ] Nomor telepon Meja Informasi
- [ ] Nomor WhatsApp resmi (dipakai di beberapa tombol "Hubungi via WhatsApp")
- [ ] Jam layanan (hari & jam buka/tutup)

## Halaman Panduan & SOP (`/panduan`)
- [ ] Nomor SOP resmi (mockup pakai "042/BLP/2024" — contoh)
- [ ] Batas masa simpan barang (mockup pakai "90 hari kalender" — perlu konfirmasi kebijakan resmi)
- [ ] Ketentuan barang bernilai tinggi / brankas khusus
- [ ] Ketentuan barang lekas rusak ("1x24 jam")
- [ ] Syarat dokumen (KTP/SIM/KTM, surat kuasa, dst.) — perlu konfirmasi berkas apa saja yang benar-benar diwajibkan
- [ ] Link/file unduhan format Surat Kuasa & Formulir BAST (belum ada filenya sama sekali, tombol saat ini non-aktif)

## Halaman FAQ (`/faq`)
- [ ] Seluruh isi jawaban (12 pertanyaan) — murni contoh dari AI, perlu ditulis ulang oleh pihak Balai atau setidaknya diverifikasi akurasinya sebelum publish

## Statistik di Beranda
- [ ] Angka statistik (barang tersimpan/dikembalikan) SUDAH dihitung otomatis dari database asli — bukan placeholder, aman dipakai.

---
Setelah semua poin di atas diisi dengan data resmi, banner "Konten
Contoh" di halaman `/panduan` dan `/faq` bisa dihapus (lihat komponen
`components/ContohKontenBanner.tsx`).
