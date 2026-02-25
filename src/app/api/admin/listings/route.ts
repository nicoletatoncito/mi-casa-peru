// src/app/api/admin/listings/route.ts
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import {
  adminCreateListing,
  adminListListings,
  validateAdminListingInput,
} from "@/lib/db/adminListings";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: auth.status });
  }

  const items = await adminListListings();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  const parsed = validateAdminListingInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const created = await adminCreateListing(parsed.value);
    return NextResponse.json({ ok: true, item: created });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error creating listing" },
      { status: 500 }
    );
  }
}