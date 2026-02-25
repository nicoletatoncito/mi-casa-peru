// src/lib/db/adminListings.ts
import "server-only";
import { createServerSupabaseAdmin } from "@/lib/supabase";
import type { Listing } from "@/lib/db/properties";

const SELECT =
  "id,title,description,price_pen,operation,property_type,beds,baths,parking,area_m2,city,district,address,lat,lng,image_url,featured,verified,status,created_at";

export type AdminListingInput = {
  title: string;
  description?: string | null;
  price_pen?: number | null;
  operation: "venta" | "alquiler";
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
  featured?: boolean;
  verified?: boolean;
  status: "published" | "draft" | "archived";
};

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

export function validateAdminListingInput(payload: any): {
  ok: true;
  value: AdminListingInput;
} | { ok: false; error: string } {
  const title = normalizeText(payload?.title);
  const operation = payload?.operation;
  const property_type = normalizeText(payload?.property_type);
  const city = normalizeText(payload?.city);

  const status = payload?.status;
  if (!title) return { ok: false, error: "title requerido" };
  if (operation !== "venta" && operation !== "alquiler")
    return { ok: false, error: "operation inválido" };
  if (!property_type) return { ok: false, error: "property_type requerido" };
  if (!city) return { ok: false, error: "city requerido" };
  if (status !== "published" && status !== "draft" && status !== "archived")
    return { ok: false, error: "status inválido" };

  const lat = Number(payload?.lat);
  const lng = Number(payload?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng))
    return { ok: false, error: "lat/lng inválidos" };

  const value: AdminListingInput = {
    title,
    operation,
    property_type,
    city,
    status,
    description: normalizeText(payload?.description),
    price_pen: toNumberOrNull(payload?.price_pen),
    beds: toNumberOrNull(payload?.beds),
    baths: toNumberOrNull(payload?.baths),
    parking: toNumberOrNull(payload?.parking),
    area_m2: toNumberOrNull(payload?.area_m2),
    district: normalizeText(payload?.district),
    address: normalizeText(payload?.address),
    lat,
    lng,
    image_url: normalizeText(payload?.image_url),
    featured: toBool(payload?.featured),
    verified: toBool(payload?.verified),
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

export async function adminUpdateListing(id: string, input: AdminListingInput) {
  const supabase = createServerSupabaseAdmin();
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