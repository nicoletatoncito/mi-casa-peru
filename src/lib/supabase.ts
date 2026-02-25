// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente para SERVER (Server Components, Route Handlers)
 */
export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase ENV variables");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

/**
 * Cliente para CLIENT COMPONENTS (si luego lo necesitas)
 */
export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}