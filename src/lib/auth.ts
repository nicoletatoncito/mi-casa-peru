// src/lib/auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseAdmin } from "./supabase";

const ADMIN_SESSION_COOKIE = "mc_admin";
const ADMIN_USER_ID_COOKIE = "mc_admin_user_id";

export type UserRole = "admin" | "agent" | string;

export async function setAdminSessionCookie(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  cookieStore.set(ADMIN_USER_ID_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  cookieStore.delete(ADMIN_USER_ID_COOKIE);
}

export async function getUserRole(): Promise<UserRole | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(ADMIN_USER_ID_COOKIE)?.value;
  if (!userId) return null;

  const supabase = createServerSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user role", error);
    return null;
  }

  return (data?.role as UserRole | undefined) ?? "agent";
}

// ✅ Protege páginas (Server Components) con redirect
export async function requireAdminSession(redirectTo: string = "/login") {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!value) redirect(`${redirectTo}?redirect=/admin`);

  const role = await getUserRole();
  if (role !== "admin") redirect(redirectTo);
}

// ✅ Protege Route Handlers / APIs (NO redirect)
export async function requireAdminApi(): Promise<
  { ok: true; userId: string; role: UserRole } | { ok: false; status: number }
> {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const userId = cookieStore.get(ADMIN_USER_ID_COOKIE)?.value;

  if (!hasSession || !userId) return { ok: false, status: 401 };

  const role = await getUserRole();
  if (role !== "admin") return { ok: false, status: 403 };

  return { ok: true, userId, role };
}