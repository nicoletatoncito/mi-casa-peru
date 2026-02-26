// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing ENV variable: ${name}`);
  return value;
}

/** ===============================
 * ✅ SERVER (PUBLIC / RLS)
 * =============================== */
export function createServerSupabase() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

/** ===============================
 * ✅ BROWSER (PUBLIC / Auth)
 * Solo para login/logout en cliente
 * =============================== */
export function createBrowserSupabase() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createClient(url, anonKey, {
    auth: {
      persistSession: false, // ✅ NO queremos que el cliente maneje sesión persistente
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/** ===============================
 * ✅ SERVER ONLY (SERVICE ROLE)
 * =============================== */
export function createServerSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("createServerSupabaseAdmin() cannot run in the browser");
  }

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRole = requireEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);

  return createClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}