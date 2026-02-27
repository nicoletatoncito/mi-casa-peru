// src/lib/db/adminListings.ts
import "server-only";
import { createServerSupabaseAdmin } from "@/lib/supabase";
import type { Listing } from "@/lib/db/properties";

/**
 * ✅ En tu público tienes unions con `| string`.
 * En Admin, mantenemos unions estrictas (mejor DX + menos bugs).
 */
export type ListingStatus = "published" | "draft" | "archived";
export type ListingOperation = "venta" | "alquiler";

const SELECT =
  "id,title,description,price_pen,operation,property_type,beds,baths,parking,area_m2,city,district,address,lat,lng,image_url,whatsapp_phone,featured,verified,status,created_at";

export type AdminListingInput = {
  title: string;
  description?: string | null;

  price_pen?: number | null;
  operation: ListingOperation;
  property_type: string;

  beds?: number | null;
  baths?: number | null;
  parking?: number | null;
  area_m2?: number | null;

  city: string;
  district?: string | null;
  address?: string | null;

  lat: number;
  lng: number;

  image_url?: string | null;
  whatsapp_phone?: string | null;

  featured?: boolean;
  verified?: boolean;
  status: ListingStatus;
};

/** ✅ Para PATCH parciales (ej: { status }) */
export type AdminListingPatch = Partial<AdminListingInput>;

function normalizeText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t : null;
}

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toBool(v: unknown): boolean {
  return v === true || v === "true" || v === 1 || v === "1";
}

function normalizePhone(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const raw = v.trim();
  if (!raw) return null;

  const digits = raw.replace(/[^\d]/g, "");
  // WhatsApp E.164 típico: 8–15 dígitos
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

export function isListingStatus(v: unknown): v is ListingStatus {
  return v === "published" || v === "draft" || v === "archived";
}

export function isListingOperation(v: unknown): v is ListingOperation {
  return v === "venta" || v === "alquiler";
}

/**
 * ✅ Validación “completa” (create o update full desde el form)
 */
export function validateAdminListingInput(
  payload: any
):
  | { ok: true; value: AdminListingInput }
  | { ok: false; error: string } {
  const title = normalizeText(payload?.title);
  const operation = payload?.operation;
  const property_type = normalizeText(payload?.property_type);
  const city = normalizeText(payload?.city);
  const status = payload?.status;

  if (!title) return { ok: false, error: "title requerido" };
  if (!isListingOperation(operation)) return { ok: false, error: "operation inválido" };
  if (!property_type) return { ok: false, error: "property_type requerido" };
  if (!city) return { ok: false, error: "city requerido" };
  if (!isListingStatus(status)) return { ok: false, error: "status inválido" };

  const lat = Number(payload?.lat);
  const lng = Number(payload?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng))
    return { ok: false, error: "lat/lng inválidos" };

  const value: AdminListingInput = {
    title,
    description: normalizeText(payload?.description),

    price_pen: toNumberOrNull(payload?.price_pen),
    operation,
    property_type,

    beds: toNumberOrNull(payload?.beds),
    baths: toNumberOrNull(payload?.baths),
    parking: toNumberOrNull(payload?.parking),
    area_m2: toNumberOrNull(payload?.area_m2),

    city,
    district: normalizeText(payload?.district),
    address: normalizeText(payload?.address),

    lat,
    lng,

    image_url: normalizeText(payload?.image_url),
    whatsapp_phone: normalizePhone(payload?.whatsapp_phone),

    featured: toBool(payload?.featured),
    verified: toBool(payload?.verified),
    status,
  };

  return { ok: true, value };
}

export async function adminListListings(): Promise<Listing[]> {
  const supabase = createServerSupabaseAdmin();

  const { data, error } = await supabase
    .from("listings")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    console.error("adminListListings error:", error);
    return [];
  }

  return (data ?? []) as Listing[];
}

export async function adminGetListingById(id: string): Promise<Listing | null> {
  const supabase = createServerSupabaseAdmin();

  const { data, error } = await supabase
    .from("listings")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("adminGetListingById error:", error);
    return null;
  }

  return (data as Listing | null) ?? null;
}

export async function adminCreateListing(input: AdminListingInput) {
  const supabase = createServerSupabaseAdmin();

  const { data, error } = await supabase
    .from("listings")
    .insert(input)
    .select(SELECT)
    .single();

  if (error) throw error;
  return data as Listing;
}

/**
 * ✅ UPDATE flexible:
 * - permite PATCH parcial (ej: { status })
 * - permite update completo (input del form)
 */
export async function adminUpdateListing(id: string, input: AdminListingPatch) {
  const supabase = createServerSupabaseAdmin();

  if (!input || Object.keys(input).length === 0) {
    throw new Error("No fields to update");
  }

  const { data, error } = await supabase
    .from("listings")
    .update(input)
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) throw error;
  return data as Listing;
}

export async function adminDeleteListing(id: string) {
  const supabase = createServerSupabaseAdmin();
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) throw error;
}