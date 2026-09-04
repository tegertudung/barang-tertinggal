import { BarangForm } from "@/components/BarangForm";
import { createItem } from "@/lib/actions/barang";
import { createClient } from "@/lib/supabase/server";

async function suggestKodeBarang(supabase: Awaited<ReturnType<typeof createClient>>) {
  const tahun = new Date().getFullYear();
  const prefix = `BLG-${tahun}-`;

  const { data } = await supabase
    .from("items")
    .select("kode_barang")
    .ilike("kode_barang", `${prefix}%`)
    .order("kode_barang", { ascending: false })
    .limit(1)
    .maybeSingle<{ kode_barang: string }>();

  let urut = 1;
  if (data?.kode_barang) {
    const angka = parseInt(data.kode_barang.slice(prefix.length), 10);
    if (!Number.isNaN(angka)) urut = angka + 1;
  }

  return `${prefix}${String(urut).padStart(3, "0")}`;
}

export default async function TambahBarangPage() {
  const supabase = await createClient();

  const [suggestedKode, { data: { user } }] = await Promise.all([
    suggestKodeBarang(supabase),
    supabase.auth.getUser(),
  ]);

  let petugasNama: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nama")
      .eq("id", user.id)
      .maybeSingle<{ nama: string }>();
    petugasNama = profile?.nama;
  }

  return (
    <div>
      <nav className="mb-1 text-sm text-black/50">
        Data Barang <span className="mx-1">›</span>
        <span className="font-medium text-brand-primary">Tambah Barang Baru</span>
      </nav>
      <h1 className="mb-1 text-xl font-bold">Form Registrasi Barang Tertinggal</h1>
      <p className="mb-6 text-sm text-black/60">
        Pastikan nomor registrasi dan data fisik dicatat secara akurat untuk
        mempermudah pencocokan klaim pemustaka.
      </p>
      <BarangForm action={createItem} suggestedKode={suggestedKode} petugasNama={petugasNama} />
    </div>
  );
}
