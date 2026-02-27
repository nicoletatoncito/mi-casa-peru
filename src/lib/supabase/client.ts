"use client";

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createSupabaseBrowser() {
  if (!SUPABASE_URL) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_ANON) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
}