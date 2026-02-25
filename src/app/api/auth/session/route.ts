// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/auth";
import { createServerSupabaseAdmin } from "@/lib/supabase";

type Body = { accessToken?: string } | null;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Body;

  const accessToken = body?.accessToken?.trim();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Missing accessToken" },
      { status: 400 }
    );
  }

  // ✅ Verificamos token real con Supabase Admin
  const supabaseAdmin = createServerSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Invalid session" },
      { status: 401 }
    );
  }

  // ✅ Set cookie segura (httpOnly) con el userId validado
  await setAdminSessionCookie(data.user.id);

  return NextResponse.json({ ok: true });
}

