// src/app/api/admin/listings/[id]/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import {
  adminDeleteListing,
  adminUpdateListing,
  validateAdminListingInput,
  isListingStatus,
} from "@/lib/db/adminListings";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function revalidateAll(id: string) {
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${id}`);
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${id}`);
}

type Ctx = { params: Promise<{ id: string }> };

/**
 * PATCH
 * - Caso A: PATCH rápido solo status: { status }
 * - Caso B: PATCH completo del form (validado)
 */
export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id } = await params;
  const body: unknown = await req.json().catch(() => null);

  // ✅ Caso A: PATCH rápido solo status
  if (isPlainObject(body) && Object.keys(body).length === 1 && "status" in body) {
    const nextStatus = (body as any).status;

    if (!isListingStatus(nextStatus)) {
      return NextResponse.json(
        { ok: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    try {
      const updated = await adminUpdateListing(id, { status: nextStatus });
      revalidateAll(id);
      return NextResponse.json({ ok: true, item: updated });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Error updating status";
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
  }

  // ✅ Caso B: payload completo del form
  const parsed = validateAdminListingInput(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: 400 }
    );
  }

  try {
    const updated = await adminUpdateListing(id, parsed.value);
    revalidateAll(id);
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error updating listing";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE
 */
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id } = await params;

  try {
    await adminDeleteListing(id);
    revalidateAll(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error deleting listing";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}