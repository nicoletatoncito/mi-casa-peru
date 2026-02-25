import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function POST(_req: NextRequest) {
  clearAdminSessionCookie();
  return NextResponse.json({ ok: true });
}

