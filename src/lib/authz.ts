import { createSupabaseServer } from "@/lib/supabase/server";

export async function getMyRole(orgId: string) {
  const supabase = await createSupabaseServer(); // ✅ ahora await

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data } = await supabase
    .from("org_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.role ?? null;
}