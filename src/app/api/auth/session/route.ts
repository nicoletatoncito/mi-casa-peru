import { NextRequest, NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { userId?: string } | null;

  if (!body?.userId) {
    return NextResponse.json({ ok: false, error: "Missing userId" }, { status: 400 });
  }

  setAdminSessionCookie(body.userId);
  return NextResponse.json({ ok: true });
}

