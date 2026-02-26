// src/app/api/admin/listings/[id]/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import {
  adminDeleteListing,
  adminUpdateListing,
  validateAdminListingInput,
} from "@/lib/db/adminListings";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = validateAdminListingInput(body);

  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: 400 }
    );
  }

  try {
    const updated = await adminUpdateListing(id, parsed.value);

    // ✅ Revalida rutas (en vez de tags)
    revalidatePath("/");
    revalidatePath("/propiedades");
    revalidatePath(`/propiedades/${id}`);

    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error updating listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id } = await ctx.params;

  try {
    await adminDeleteListing(id);

    // ✅ Revalida rutas (en vez de tags)
    revalidatePath("/");
    revalidatePath("/propiedades");
    revalidatePath(`/propiedades/${id}`);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error deleting listing" },
      { status: 500 }
    );
  }
}