// src/lib/db/properties.ts
import "server-only";
import { createServerSupabase } from "@/lib/supabase";

export type ListingStatus = "draft" | "published" | "archived" | string;
export type Operation = "venta" | "alquiler" | string;

export type Property = {
  id: string;
  title: string;
  description?: string | null;

  status: ListingStatus;
  operation: Operation;
  property_type: string;

  district?: string | null;
  city?: string | null;
  address?: string | null;

  price_pen?: number | null;
  beds?: number | null;
  baths?: number | null;
  parking?: number | null;
  area_m2?: number | null;

  lat?: number | null;
  lng?: number | null;

  featured?: boolean | null;
  verified?: boolean | null;

  image_url?: string | null;

  whatsapp_phone?: string | null;

  created_at?: string | null;
};

export type Listing = Property;

const LISTING_SELECT_FULL = `
  id,
  title,
  description,
  status,
  operation,
  property_type,
  district,
  city,
  address,
  price_pen,
  beds,
  baths,
  parking,
  area_m2,
  lat,
  lng,
  featured,
  verified,
  image_url,
  whatsapp_phone,
  created_at
`;

const LISTING_SELECT_CARD = `
  id,
  title,
  status,
  operation,
  property_type,
  district,
  city,
  price_pen,
  beds,
  baths,
  area_m2,
  lat,
  lng,
  featured,
  verified,
  image_url,
  whatsapp_phone,
  created_at
`;

function safeInt(n: unknown): number | null {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : null;
}

function cleanText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT_FULL)
    .eq("id", id)
    .maybeSingle();

  if (error) return null;
  return (data as Property) ?? null;
}

/** ✅ Solo público: solo devuelve si está published */
export async function getPropertyByIdPublic(id: string): Promise<Property | null> {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT_FULL)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) return null;
  return (data as Property) ?? null;
}

export async function getProperties(args: {
  q?: string;
  operation?: "venta" | "alquiler";
  type?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "relevance";
  limit?: number;
}): Promise<Property[]> {
  const supabase = createServerSupabase();
  const limit = Math.max(1, Math.min(args.limit ?? 60, 200));

  let query = supabase
    .from("listings")
    .select(LISTING_SELECT_CARD)
    .eq("status", "published")
    .limit(limit);

  if (args.operation) query = query.eq("operation", args.operation);
  if (args.type) query = query.eq("property_type", args.type);
  if (args.district) query = query.ilike("district", `%${args.district}%`);

  if (typeof args.minPrice === "number") query = query.gte("price_pen", args.minPrice);
  if (typeof args.maxPrice === "number") query = query.lte("price_pen", args.maxPrice);

  if (typeof args.beds === "number") query = query.gte("beds", args.beds);
  if (typeof args.baths === "number") query = query.gte("baths", args.baths);

  if (args.q?.trim()) {
    const q = args.q.trim();
    query = query.or(
      `title.ilike.%${q}%,district.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`
    );
  }

  switch (args.sort) {
    case "price_asc":
      query = query.order("price_pen", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price_pen", { ascending: false, nullsFirst: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false, nullsFirst: false });
      break;
  }

  const { data, error } = await query;
  if (error) return [];
  return (data as Property[]) ?? [];
}

/** ✅ Premium: paginación REAL + total + totalPages (para tu UI) */
export async function getPropertiesPaged(args: {
  q?: string;
  operation?: "venta" | "alquiler";
  type?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "relevance";
  page?: number; // 1-based
  pageSize?: number;
}): Promise<{
  items: Property[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}> {
  const supabase = createServerSupabase();

  const pageSize = Math.max(1, Math.min(args.pageSize ?? 24, 80));
  const page = Math.max(1, args.page ?? 1);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("listings")
    .select(LISTING_SELECT_CARD, { count: "exact" })
    .eq("status", "published");

  if (args.operation) query = query.eq("operation", args.operation);
  if (args.type) query = query.eq("property_type", args.type);
  if (args.district) query = query.ilike("district", `%${args.district}%`);

  if (typeof args.minPrice === "number") query = query.gte("price_pen", args.minPrice);
  if (typeof args.maxPrice === "number") query = query.lte("price_pen", args.maxPrice);

  if (typeof args.beds === "number") query = query.gte("beds", args.beds);
  if (typeof args.baths === "number") query = query.gte("baths", args.baths);

  if (args.q?.trim()) {
    const q = args.q.trim();
    query = query.or(
      `title.ilike.%${q}%,district.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`
    );
  }

  switch (args.sort) {
    case "price_asc":
      query = query.order("price_pen", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price_pen", { ascending: false, nullsFirst: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false, nullsFirst: false });
      break;
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return { items: [], page, pageSize, total: 0, totalPages: 1 };
    }
  const total = safeInt(count) ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: (data as Property[]) ?? [],
    page,
    pageSize,
    total,
    totalPages,
  };
}