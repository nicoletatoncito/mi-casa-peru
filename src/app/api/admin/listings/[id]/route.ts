// src/app/api/admin/listings/[id]/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { createServerSupabaseAdmin } from "@/lib/supabase";
import {
  adminDeleteListing,
  adminUpdateListing,
  validateAdminListingInput,
  isListingOperation,
  isListingStatus,
  type ListingOperation,
  type ListingStatus,
} from "@/lib/db/adminListings";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

function revalidateAll(id: string) {
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${id}`);
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${id}`);
}

/**
 * PATCH
 * - Caso 1: PATCH rápido solo status: { status }
 * - Caso 2: PATCH completo del form (validado)
 */
export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id } = ctx.params;
  const body: unknown = await req.json().catch(() => null);

  // ✅ Caso 1: PATCH rápido solo status
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

  // ✅ Caso 2: payload completo del form (validado)
  const parsed = validateAdminListingInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
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
 * DELETE: elimina listing
 */
export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id } = ctx.params;

  try {
    await adminDeleteListing(id);
    revalidateAll(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error deleting listing";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * POST: acción avanzada
 * - { action: "duplicate" } -> duplica el listing como draft (sin copiar storage)
 */
export async function POST(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id } = ctx.params;
  const body: unknown = await req.json().catch(() => null);

  const action = isPlainObject(body)
    ? (getString(body, "action") ?? "").toLowerCase()
    : "";

  if (action !== "duplicate") {
    return NextResponse.json(
      { ok: false, error: 'Invalid action. Use { action: "duplicate" }' },
      { status: 400 }
    );
  }

  type ListingSelected = {
    title: string | null;
    description: string | null;
    price_pen: number | null;
    operation: ListingOperation | null;
    property_type: string | null;
    beds: number | null;
    baths: number | null;
    parking: number | null;
    area_m2: number | null;
    city: string | null;
    district: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    image_url: string | null;
    whatsapp_phone: string | null;
    featured: boolean | null;
    verified: boolean | null;
    status: ListingStatus | null;
  };

  try {
    const supabase = createServerSupabaseAdmin();

    const selectCols = [
      "title",
      "description",
      "price_pen",
      "operation",
      "property_type",
      "beds",
      "baths",
      "parking",
      "area_m2",
      "city",
      "district",
      "address",
      "lat",
      "lng",
      "image_url",
      "whatsapp_phone",
      "featured",
      "verified",
      "status",
    ].join(",");

    const { data, error: srcErr } = await supabase
      .from("listings")
      .select(selectCols)
      .eq("id", id)
      .single();

    if (srcErr || !data || typeof data !== "object") {
      return NextResponse.json({ ok: false, error: "Listing not found" }, { status: 404 });
    }

    const src = data as ListingSelected;

    // Guardrails: lat/lng deben existir (tu schema y tu app los usan siempre)
    if (!Number.isFinite(src.lat ?? NaN) || !Number.isFinite(src.lng ?? NaN)) {
      return NextResponse.json(
        { ok: false, error: "No se puede duplicar: el listing origen no tiene lat/lng válidos." },
        { status: 400 }
      );
    }

    const baseTitle = src.title ? String(src.title) : "Propiedad";
    const dupTitle = `${baseTitle} (copia)`;

    const safeOperation: ListingOperation = isListingOperation(src.operation)
      ? src.operation
      : "venta";

    const insertPayload = {
      title: dupTitle,
      description: src.description ?? null,
      price_pen: src.price_pen ?? null,
      operation: safeOperation,
      property_type: src.property_type ?? "Departamento",
      beds: src.beds ?? null,
      baths: src.baths ?? null,
      parking: src.parking ?? null,
      area_m2: src.area_m2 ?? null,
      city: src.city ?? "Lima",
      district: src.district ?? null,
      address: src.address ?? null,
      lat: Number(src.lat),
      lng: Number(src.lng),
      image_url: src.image_url ?? null,
      whatsapp_phone: src.whatsapp_phone ?? null,

      // reglas pro
      status: "draft" as const,
      featured: false,
      verified: false,
    };

    const { data: created, error: insErr } = await supabase
      .from("listings")
      .insert(insertPayload)
      .select("id")
      .single();

    if (insErr || !created?.id) {
      return NextResponse.json(
        { ok: false, error: insErr?.message ?? "Error duplicating listing" },
        { status: 500 }
      );
    }

    const newId = String(created.id);

    revalidatePath("/admin/listings");
    revalidatePath(`/admin/listings/${newId}`);
    revalidatePath("/propiedades");
    revalidatePath(`/propiedades/${newId}`);

    return NextResponse.json({
      ok: true,
      action: "duplicate",
      newId,
      redirectTo: `/admin/listings/${newId}`,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error duplicating listing";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}