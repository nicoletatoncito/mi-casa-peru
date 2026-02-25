// src/lib/db/properties.ts
import { createServerSupabase } from "../supabase";

export type Listing = {
  id: string;
  title: string;
  description: string | null;
  price_pen: number | null;
  operation: "venta" | "alquiler";
  property_type: string;
  beds: number | null;
  baths: number | null;
  parking: number | null;
  area_m2: number | null;
  city: string;
  district: string | null;
  address: string | null;
  lat: number;
  lng: number;
  image_url: string | null;
  featured: boolean;
  verified: boolean;
  status: "published" | "draft" | "archived";
  created_at: string;
};

export type ListingsFilters = {
  q?: string;
  operation?: "venta" | "alquiler";
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "relevance";
  page?: number; // 1-based
  pageSize?: number;
};

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const SELECT =
  "id,title,description,price_pen,operation,property_type,beds,baths,parking,area_m2,city,district,address,lat,lng,image_url,featured,verified,status,created_at";

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Escapa caracteres especiales para ILIKE:
 * - % y _ son wildcards en SQL LIKE.
 * - \ es el caracter de escape.
 */
function escapeForILike(input: string) {
  return input.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}

function buildQuery(
  supabase: ReturnType<typeof createServerSupabase>,
  filters: ListingsFilters
) {
  const { q, operation, type, minPrice, maxPrice, beds, baths, sort = "newest" } = filters;

  let query = supabase
    .from("listings")
    .select(SELECT, { count: "exact" })
    .eq("status", "published");

  if (q && q.trim().length >= 2) {
    const term = escapeForILike(q.trim());

    // Nota: usamos ILIKE con patrón %term% para múltiples campos.
    // El escape evita que el usuario meta % o _ y cambie el patrón.
    query = query.or(
      `title.ilike.%${term}%,city.ilike.%${term}%,district.ilike.%${term}%,address.ilike.%${term}%`
    );
  }

  if (operation) query = query.eq("operation", operation);
  if (type && type.trim()) query = query.eq("property_type", type.trim());
  if (typeof minPrice === "number") query = query.gte("price_pen", minPrice);
  if (typeof maxPrice === "number") query = query.lte("price_pen", maxPrice);
  if (typeof beds === "number") query = query.gte("beds", beds);
  if (typeof baths === "number") query = query.gte("baths", baths);

  // Orden estable: SIEMPRE terminamos con id para evitar saltos por empates
  if (sort === "price_asc") {
    query = query.order("price_pen", { ascending: true, nullsFirst: false });
    query = query.order("created_at", { ascending: false });
    query = query.order("id", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price_pen", { ascending: false, nullsFirst: false });
    query = query.order("created_at", { ascending: false });
    query = query.order("id", { ascending: true });
  } else {
    // "newest" y "relevance" (por ahora: featured/verified/newest)
    query = query.order("featured", { ascending: false });
    query = query.order("verified", { ascending: false });
    query = query.order("created_at", { ascending: false });
    query = query.order("id", { ascending: true });
  }

  return query;
}

/** ✅ HOME: últimas publicaciones */
export async function getLatestListings(limit = 6): Promise<Listing[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getLatestListings error:", error);
    return [];
  }
  return (data ?? []) as Listing[];
}

/** ✅ LISTADO: paginado */
export async function getPropertiesPaged(
  filters: ListingsFilters = {}
): Promise<PagedResult<Listing>> {
  const supabase = createServerSupabase();

  const pageSize = clampInt(filters.pageSize ?? 12, 5, 60);
  const page = clampInt(filters.page ?? 1, 1, 100000);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await buildQuery(supabase, filters).range(from, to);

  if (error) {
    console.error("getPropertiesPaged error:", error);
    return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count ?? 0;
  const totalPages = total ? Math.ceil(total / pageSize) : 0;

  return {
    items: (data ?? []) as Listing[],
    total,
    page,
    pageSize,
    totalPages,
  };
}

/** Compat simple (mantiene limit) */
export async function getProperties(
  filters: Omit<ListingsFilters, "page" | "pageSize"> & { limit?: number } = {}
) {
  const pageSize = typeof filters.limit === "number" ? filters.limit : 60;

  // quitamos `limit` para no pasarlo a getPropertiesPaged
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { limit, ...rest } = filters;

  const res = await getPropertiesPaged({ ...rest, page: 1, pageSize });
  return res.items;
}

/** ✅ DETALLE */
export async function getPropertyById(id: string): Promise<Listing | null> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getPropertyById error:", error);
    return null;
  }
  return (data ?? null) as Listing | null;
}

// Alias por si tu código viejo los usa
export const fetchAllProperties = getProperties;
export const fetchPropertyById = getPropertyById;