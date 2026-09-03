import { createClient } from "@/lib/supabase/server";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("nama, status, created_at")
        .eq("id", user.id)
        .maybeSingle<{ nama: string; status: string; created_at: string }>()
    : { data: null };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-xl font-bold">Profil</h1>
        <p className="text-sm text-black/60">
          Informasi akun petugas.
        </p>
      </div>

      <dl className="space-y-3 rounded-lg border border-black/10 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-black/60">Nama</dt>
          <dd className="font-medium">{profile?.nama ?? "-"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-black/60">Email</dt>
          <dd className="font-medium">{user?.email}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-black/60">Status</dt>
          <dd className="font-medium">{profile?.status ?? "-"}</dd>
        </div>
      </dl>
    </div>
  );
}
