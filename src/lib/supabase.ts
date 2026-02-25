// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing Supabase ENV variable: ${name}`);
  return value;
}

/**
 * ✅ SERVER (PUBLIC / RLS)
 * Para Server Components públicos (home, propiedades, detalle).
 * Usa ANON/PUBLISHABLE (sb_publishable...) y deja que RLS controle el acceso.
 */
export function createServerSupabase() {
  const url = requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );

  const anonKey = requireEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

/**
 * ✅ SERVER (ADMIN)
 * Para operaciones administrativas donde necesitas bypass de RLS.
 * Requiere SERVICE ROLE (sb_secret...) y SOLO debe ejecutarse en servidor.
 */
export function createServerSupabaseAdmin() {
  const url = requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );

  const serviceKey = requireEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

/**
 * ✅ BROWSER
 * Cliente para Client Components (login, logout, etc.)
 */
export function createBrowserSupabase() {
  const url = requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );

  const anonKey = requireEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return createClient(url, anonKey);
}